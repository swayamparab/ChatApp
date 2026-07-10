"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { signup } from "@/services/auth";
import { signupSchema, type SignupRequest } from "@/schemas/auth";

export default function SignupForm() {
    const [serverError, setServerError] = useState("");

    const router = useRouter();

    const signupMutation = useMutation({
        mutationFn: signup,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupRequest>({
        resolver: zodResolver(signupSchema),
    });

    async function onSubmit(data: SignupRequest) {
        setServerError("");

        try {
            await signupMutation.mutateAsync(data);

            router.push("/login");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setServerError(
                    error.response?.data?.message ?? "Something went wrong"
                );
            } else {
                setServerError("Something went wrong");
            }
        }
    }

    return (
        <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow">
            <h1 className="mb-6 text-center text-2xl font-bold">
                Create Account
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-medium"
                    >
                        Username
                    </label>

                    <Input
                        id="username"
                        placeholder="Enter username"
                        {...register("username")}
                    />

                    {errors.username && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                    >
                        Email
                    </label>

                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        {...register("email")}
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium"
                    >
                        Password
                    </label>

                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        {...register("password")}
                    />

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {serverError && (
                    <p className="text-sm text-red-500">
                        {serverError}
                    </p>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={signupMutation.isPending}
                >
                    {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>
            </form>
        </div>
    );
}