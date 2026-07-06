import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.url(),

  JWT_SECRET: z.string().min(32, "JWT_SECRET should be at least 32 characters"),

  CLIENT_URL: z.url(),
});

export const env = envSchema.parse(process.env);