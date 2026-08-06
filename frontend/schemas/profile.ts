import { z } from "zod";

export const updateProfileSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(3)
            .max(20),

        currentPassword: z.string().optional(),

        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters.")
            .optional(),

        confirmPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
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
    });

export type UpdateProfileForm =
    z.infer<typeof updateProfileSchema>;