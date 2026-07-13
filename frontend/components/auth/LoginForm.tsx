"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { login } from "@/services/auth";
import { loginSchema, type LoginRequest } from "@/schemas/auth";
import { queryKeys } from "@/lib/query-keys";

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
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      <h1 className="mb-2 text-center text-3xl font-bold text-white">
        Welcome Back
      </h1>

      <p className="mb-8 text-center text-sm text-slate-400">
        Sign in to continue chatting.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="identifier"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Username or Email
          </label>

          <Input
            id="identifier"
            placeholder="Enter username or email"
            {...register("identifier")}
            className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
          />

          {errors.identifier && (
            <p className="mt-2 text-sm text-red-400">
              {errors.identifier.message}
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
          disabled={loginMutation.isPending}
          className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          {loginMutation.isPending
            ? "Signing In..."
            : "Sign In"}
        </Button>
      </form>
    </div>
  );
}