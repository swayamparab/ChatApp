import { Request, Response } from "express";
import { getConversations } from "./conversation.service";

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