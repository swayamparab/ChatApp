import { Request, Response } from "express";
import { getConversations, markConversationAsRead } from "./conversation.service";

export async function getConversationsController(req: Request, res: Response) {
    try {

        const conversations = await getConversations(req.userId);

        return res.status(200).json({
            success: true,
            conversations
        })
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

type Params = {
    conversationId: string;
};
export async function markConversationAsReadController(
    req: Request<Params>,
    res: Response
) {
    try {
        const { conversationId } = req.params;
        const userId = req.userId!;

        await markConversationAsRead(conversationId, userId);

        res.status(200).json({
            success: true,
            message: "Conversation marked as read",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
}