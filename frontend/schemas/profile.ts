import { z } from "zod";

export const updateProfileSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters.")
            .max(20, "Username cannot exceed 20 characters.")
            .optional(),

        currentPassword: z.string().optional(),

        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters.")
            .optional(),

        confirmPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        // Password validation
        if (data.newPassword) {
            if (!data.currentPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["currentPassword"],
                    message: "Current password is required.",
                });
            }

            if (data.newPassword !== data.confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["confirmPassword"],
                    message: "Passwords do not match.",
                });
            }
        }

        // At least one field should be changed
        if (
            !data.username &&
            !data.newPassword
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["username"],
                message: "Nothing to update.",
            });
        }
    });

export type UpdateProfileForm =
    z.infer<typeof updateProfileSchema>;