import { z } from "zod";

export const loginSchema = z.object({
    identifier: z
        .string()
        .min(1, "Username or email is required"),

    password: z
        .string()
        .min(1, "Password is required"),
});

export interface LoginRequest {
  identifier: string;
  password: string;
}

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  email: z
    .email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type SignupRequest = z.infer<typeof signupSchema>;