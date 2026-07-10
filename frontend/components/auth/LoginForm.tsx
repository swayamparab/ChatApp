"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/query-keys";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { login } from "@/services/auth";
import { loginSchema, type LoginRequest } from "@/schemas/auth";
import { useState } from "react";
import axios from "axios";

export default function LoginForm() {

  const [serverError, setServerError] = useState("");

  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: login,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginRequest) {
    setServerError("");

    try {
      const response = await loginMutation.mutateAsync(data);

      queryClient.setQueryData(
        queryKeys.currentUser,
        response
      );

      router.push("/chat");

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
    <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow">
      <h1 className="mb-6 text-center text-2xl font-bold">
        Sign In
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="identifier"
            className="mb-2 block text-sm font-medium"
          >
            Username or Email
          </label>

          <Input
            id="identifier"
            placeholder="Enter username or email"
            {...register("identifier")}
          />

          {errors.identifier && (
            <p className="mt-1 text-sm text-red-500">
              {errors.identifier.message}
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
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}