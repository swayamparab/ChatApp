import { Request, Response } from "express";

import { ZodError } from "zod";

import { searchUsersSchema, updateProfileSchema } from "./user.validation";
import { searchUsers, updateProfile } from "./user.service";
import { getRelationshipStatus } from "../chat-request/chat-request.service";
import { getExistingConversations } from "../conversation/conversation.service";

export async function updateProfileController(
    req: Request,
    res: Response
) {
    try {
        const data = updateProfileSchema.parse(req.body);

        const user = await updateProfile(
            req.userId,
            data
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }

        if (error instanceof Error) {
            switch (error.message) {
                case "Username already exists":
                case "Current password is incorrect":
                case "Nothing to update":
                case "User not found":
                    return res.status(400).json({
                        success: false,
                        message: error.message,
                    });
            }
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export async function searchUsersController(req: Request, res: Response) {
    try {
        const { q } = searchUsersSchema.parse(req.query);

        const users = await searchUsers(req.userId!, q);

        const relationshipMap = await getRelationshipStatus(
            req.userId!,
            users.map((user) => user.id)
        );

        const conversationMap = await getExistingConversations(
            req.userId!,
            users.map((user) => user.id)
        );

        const result = users.map((user) => {
            const conversation =
                conversationMap.get(user.id);

            if (conversation) {
                return {
                    ...user,
                    relationship: "friends",
                    conversationId: conversation.conversationId,
                    requestId: null,
                };
            }

            const relationship =
                relationshipMap.get(user.id);

            return {
                ...user,
                relationship:
                    relationship?.relationship ?? "none",
                requestId:
                    relationship?.requestId ?? null,
                conversationId: null,
            };
        });

        return res.json({
            success: true,
            users: result,
        });

    } catch (error) {
        console.error(error);

        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}