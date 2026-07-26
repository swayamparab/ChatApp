import { Request, Response } from "express";
import { getMessagesSchema } from "./message.validation";
import { getMessages, sendMessage } from "./message.service";
import { ZodError } from "zod";
import { uploadImage } from "../../services/upload.service";

export async function getMessagesController(req: Request, res: Response) {

    try {
        const data = getMessagesSchema.parse({
            conversationId: req.params.conversationId,
            before: req.query.before,
            limit: req.query.limit
        });

        const result = await getMessages(req.userId, data);

        return res.status(200).json({
            success: true,
            messages: result.messages,
            lastReadAt: result.lastReadAt,
            nextCursor: result.nextCursor,
            hasMore: result.hasMore,
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

export async function uploadImageController(
    req: Request,
    res: Response
) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required.",
            });
        }

        const upload = await uploadImage(req.file.buffer);

        return res.status(200).json({
            success: true,
            attachmentUrl: upload.secure_url,
            attachmentPublicId: upload.public_id,
            attachmentMimeType: req.file.mimetype,
            attachmentSize: upload.bytes,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload image.",
        });
    }
}

//never used in frontend since socket version is used
// export async function sendMessageController(req: Request, res: Response) {
//     try {

//         const data = sendMessageSchema.parse({
//             ...req.params,
//             ...req.body
//         });

//         const message = await sendMessage(req.userId, data);

//         return res.status(201).json({
//             success: true,
//             message,
//         });

//     }
//     catch (error) {
//         console.error(error);

//         if (error instanceof ZodError) {
//             return res.status(400).json({
//                 success: false,
//                 errors: error.issues,
//             });
//         }

//         if (error instanceof Error) {
//             switch (error.message) {
//                 case "You are not a participant of this conversation":
//                     return res.status(403).json({
//                         success: false,
//                         message: error.message,
//                     });
//             }
//         }

//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         });
//     }
// }