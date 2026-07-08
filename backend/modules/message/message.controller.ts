import { Request, Response } from "express";
import { getMessagesSchema } from "./message.validation";
import { getMessages } from "./message.service";
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