import { Request, Response } from "express";
import { getMessagesSchema, sendMessageSchema } from "./message.validation";
import { getMessages, sendMessage } from "./message.service";
import { ZodError } from "zod";

export async function getMessagesController(req: Request, res: Response) {

    try {
        const data = getMessagesSchema.parse(req.params);

        const messages = await getMessages(req.userId, data);

        return res.status(200).json({
            success: true,
            messages,
        });
    }
    catch (error) {
        console.error(error);

        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }

        if (error instanceof Error) {
            switch (error.message) {
                case "Unauthorized":
                    return res.status(403).json({
                        success: false,
                        message: error.message,
                    });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

//never used in frontend since socket version is used
export async function sendMessageController(req: Request, res: Response) {
    try {

        const data = sendMessageSchema.parse({
            ...req.params,
            ...req.body
        });

        const message = await sendMessage(req.userId, data);

        return res.status(201).json({
            success: true,
            message,
        });

    }
    catch (error) {
        console.error(error);

        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }

        if (error instanceof Error) {
            switch (error.message) {
                case "You are not a participant of this conversation":
                    return res.status(403).json({
                        success: false,
                        message: error.message,
                    });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}