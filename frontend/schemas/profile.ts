import { z } from "zod";

export const updateProfileSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters.")
            .max(20, "Username cannot exceed 20 characters."),

        currentPassword: z.string(),

        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters.")
            .or(z.literal("")),

        confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
        if (data.newPassword && !data.currentPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["currentPassword"],
                message: "Current password is required.",
            });
        }

        if (
            data.newPassword &&
            data.newPassword !== data.confirmPassword
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirmPassword"],
                message: "Passwords do not match.",
            });
        }
    });

export type UpdateProfileForm =
    z.infer<typeof updateProfileSchema>;