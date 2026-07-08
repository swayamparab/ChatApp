import { sendMessageSchema } from "@/modules/message/message.validation";
import { Server, Socket } from "socket.io";
import { sendMessage } from "@/modules/message/message.service";
import { ZodError } from "zod";

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
}