import { Server, Socket } from "socket.io";
import { isParticipant } from "../../modules/conversation/conversation.service";
import { findUserForCall } from "../../services/user.service";

export function registerCallEvents(io: Server, socket: Socket) {
    socket.on("call_user", async ({ conversationId, type, receiver }, callback) => {
        try {
            const allowed = await isParticipant(socket.userId, conversationId);

            if (!allowed) {
                return callback?.({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const caller = await findUserForCall(socket.userId);

            if (!caller) {
                return callback?.({
                    success: false,
                    message: "User not found",
                });
            }

            socket.to(conversationId).emit("incoming_call", {
                conversationId,
                type,
                caller,
                receiver
            })

            callback?.({
                success: true
            })
        }
        catch (error) {
            callback?.({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            });
        }
    })

    socket.on(
        "accept_call",
        async ({ conversationId }, callback) => {
            try {
                const allowed = await isParticipant(
                    socket.userId,
                    conversationId
                );

                if (!allowed) {
                    return callback?.({
                        success: false,
                        message: "Unauthorized",
                    });
                }

                socket.to(conversationId).emit("call_accepted", {
                    conversationId,
                });

                callback?.({
                    success: true,
                });
            } catch (error) {
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

    socket.on(
        "reject_call",
        async ({ conversationId }, callback) => {
            try {
                const allowed = await isParticipant(
                    socket.userId,
                    conversationId
                );

                if (!allowed) {
                    return callback?.({
                        success: false,
                        message: "Unauthorized",
                    });
                }

                socket.to(conversationId).emit("call_rejected", {
                    conversationId,
                });

                callback?.({
                    success: true,
                });
            } catch (error) {
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