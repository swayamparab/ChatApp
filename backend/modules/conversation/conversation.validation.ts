import { z } from "zod";

export const createGroupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Group name must be at least 3 characters")
        .max(50, "Group name cannot exceed 50 characters"),

    memberIds: z
        .array(z.uuid())
        .min(1, "Select at least one member")
        .max(100, "Too many members"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Group name must be at least 3 characters")
        .max(50, "Group name cannot exceed 50 characters"),
});

export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;

export const addMembersSchema = z.object({
    memberIds: z
        .array(z.uuid())
        .min(1, "Select at least one member")
        .max(100),
});

export type AddMembersInput = z.infer<typeof addMembersSchema>;