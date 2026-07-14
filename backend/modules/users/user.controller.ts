import { Request, Response } from "express";

import { ZodError } from "zod";

import { searchUsersSchema } from "./user.validation";
import { searchUsers } from "./user.service";
import { getRelationshipStatus } from "../chat-request/chat-request.service";
import { getExistingConversations } from "../conversation/conversation.service";

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