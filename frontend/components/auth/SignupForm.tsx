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
                    error.response?.data?.message ??
                        "Something went wrong"
                );
            } else {
                setServerError("Something went wrong");
            }
        }
    }

    return (
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <h1 className="mb-2 text-center text-3xl font-bold text-white">
                Create Account
            </h1>

            <p className="mb-8 text-center text-sm text-slate-400">
                Join ChatApp and start chatting instantly.
            </p>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-medium text-slate-300"
                    >
                        Username
                    </label>

                    <Input
                        id="username"
                        placeholder="Enter username"
                        {...register("username")}
                        className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    />

                    {errors.username && (
                        <p className="mt-2 text-sm text-red-400">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-slate-300"
                    >
                        Email
                    </label>

                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        {...register("email")}
                        className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    />

                    {errors.email && (
                        <p className="mt-2 text-sm text-red-400">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-slate-300"
                    >
                        Password
                    </label>

                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        {...register("password")}
                        className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
                    />

                    {errors.password && (
                        <p className="mt-2 text-sm text-red-400">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {serverError && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                        {serverError}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
                >
                    {signupMutation.isPending
                        ? "Creating Account..."
                        : "Create Account"}
                </Button>
            </form>
        </div>
    );
}