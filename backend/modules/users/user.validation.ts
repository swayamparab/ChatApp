import { z } from "zod";

export const updateProfileSchema = z
    .object({
        username: z
            .string()
            .trim()
            .min(3, "Username must be at least 3 characters.")
            .max(20, "Username cannot exceed 20 characters.")
            .regex(
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers and underscores."
            )
            .optional(),

        currentPassword: z
            .string()
            .optional(),

        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .optional(),
    })
    .refine(
        (data) => {
            if (data.newPassword) {
                return !!data.currentPassword;
            }

            return true;
        },
        {
            path: ["currentPassword"],
            message: "Current password is required.",
        }
    )
    .refine(
        (data) =>
            data.username ||
            data.newPassword,
        {
            message: "Nothing to update.",
        }
    );

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const searchUsersSchema = z.object({
    q: z.string().trim().min(2),
});

export type SearchUsersInput = z.infer<typeof searchUsersSchema>;