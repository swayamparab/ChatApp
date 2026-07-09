import { sendMessageSchema, typingSchema, deleteMessageSchema } from "../../modules/message/message.validation";
import { Server, Socket } from "socket.io";
import { sendMessage, deleteMessage } from "../../modules/message/message.service";
import { ZodError } from "zod";
import { isParticipant } from "../../modules/conversation/conversation.service";

export function registerMessageEvent(io: Server, socket: Socket) {
    socket.on("send_message", async (data, callback) => {
        try {
            const validatedData = sendMessageSchema.parse(data);

            const message = await sendMessage(socket.userId, validatedData);

            io.to(validatedData.conversationId).emit("new_message", message);

            callback({
                success: true,
            })
        }
        catch (error) {
            if (error instanceof ZodError) {
                return callback({
                    success: false,
                    errors: error.issues,
                });
            }

            callback({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            });
        }
    })

    socket.on("delete_message", async (data, callback) => {
        try {
            const validatedData = deleteMessageSchema.parse(data);

            const deletedMessage = await deleteMessage(socket.userId, validatedData);

            io.to(deletedMessage.conversationId)
                .emit("message_deleted", {
                    messageId: deletedMessage.messageId
                })

            callback?.({
                success: true,
            });
        }
        catch (error) {
            if (error instanceof ZodError) {
                return callback?.({
                    success: false,
                    errors: error.issues,
                });
            }

            callback?.({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            });
        }
    })

    socket.on("typing", async (data, callback) => {
        try {
            const validatedData = typingSchema.parse(data);

            const allowed = await isParticipant(socket.userId, validatedData.conversationId);

            if (!allowed) {
                return callback?.({
                    success: false,
                    message: "Unauthorized"
                })
            }

            socket
                .to(validatedData.conversationId)
                .emit("user_typing", {
                    converstationId: validatedData.conversationId,
                    userId: socket.userId
                })

            callback?.({
                success: true
            })

        }
        catch (error) {
            if (error instanceof ZodError) {
                return callback?.({
                    success: false,
                    errors: error.issues,
                });
            }

            callback?.({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            });
        }
    })

    socket.on("stop_typing", async (data, callback) => {
        try {
            const validatedData = typingSchema.parse(data);

            const allowed = await isParticipant(socket.userId, validatedData.conversationId);

            if (!allowed) {
                return callback?.({
                    success: false,
                    message: "Unauthorized",
                });
            }

            socket
                .to(validatedData.conversationId)
                .emit("user_stop_typing", {
                    conversationId: validatedData.conversationId,
                    userId: socket.userId,
                });

            callback?.({
                success: true,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                return callback?.({
                    success: false,
                    errors: error.issues,
                });
            }

            callback?.({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            });
        }
    }
    );

}