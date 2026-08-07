import { z } from "zod";

export const updateProfileSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters.")
            .max(20, "Username cannot exceed 20 characters."),

        currentPassword: z.string().optional(),

        newPassword: z
            .string()
            .optional(),

        confirmPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        // Only validate passwords if the user entered one
        if (
            data.currentPassword ||
            data.newPassword ||
            data.confirmPassword
        ) {
            if (!data.currentPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["currentPassword"],
                    message: "Current password is required.",
                });
            }

            if (!data.newPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["newPassword"],
                    message: "New password is required.",
                });
            }

            if (
                data.newPassword &&
                data.newPassword.length < 6
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["newPassword"],
                    message: "Password must be at least 6 characters.",
                });
            }

            if (
                data.newPassword !== data.confirmPassword
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["confirmPassword"],
                    message: "Passwords do not match.",
                });
            }
        }
    });

export type UpdateProfileForm =
    z.infer<typeof updateProfileSchema>;