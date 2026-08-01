import { Server, Socket } from "socket.io";
import { isParticipant, getConversationParticipantIds } from "../../modules/conversation/conversation.service";
import { findUserForCall } from "../../services/user.service";
import { activeCalls } from "../helpers/active-calls";

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

            if (activeCalls.has(receiver.id)) {
                return callback?.({
                    success: false,
                    message: "User is already on another call.",
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

                //check call busy
                const participantIds = await getConversationParticipantIds(conversationId);
                participantIds.forEach((id) => activeCalls.add(id));

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

    socket.on(
        "end_call",
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

                //remove caller busy status
                const participantIds = await getConversationParticipantIds(conversationId);
                participantIds.forEach((id) => activeCalls.delete(id));

                socket.to(conversationId).emit("end_call", {
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