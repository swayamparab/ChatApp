import { Server, Socket } from "socket.io";

import {
    isParticipant,
    getConversationParticipantIds,
} from "../../modules/conversation/conversation.service";

import {
    getGroupCallParticipants,
    isGroupCallFull,
    joinGroupCall,
    leaveGroupCall,
} from "../helpers/group-call-state";

import {
    createGroupCall,
    endGroupCall,
    getActiveGroupCall,
} from "../../services/group-call.service";

export function registerGroupCallEvents(io: Server, socket: Socket) {

    socket.on("group_call:start", async ({ conversationId }, callback) => {
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

            if (isGroupCallFull(conversationId)) {
                return callback?.({
                    success: false,
                    message:
                        "Group call is full.",
                });
            }

            joinGroupCall(
                conversationId,
                socket.userId
            );

            socket.join(
                `group-call:${conversationId}`
            );

            callback?.({
                success: true,
                participants:
                    getGroupCallParticipants(
                        conversationId
                    ),
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
    });

    socket.on("group_call:join", async ({ conversationId }, callback) => {
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

            if (isGroupCallFull(conversationId)) {
                return callback?.({
                    success: false,
                    message: "Group call is full.",
                });
            }

            joinGroupCall(
                conversationId,
                socket.userId
            );

            socket.join(`group-call:${conversationId}`);

            io.to(`group-call:${conversationId}`).emit(
                "group_call:user_joined",
                {
                    userId: socket.userId,
                }
            );

            callback?.({
                success: true,
                participants:
                    getGroupCallParticipants(
                        conversationId
                    ),
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
    });

    socket.on("group_call:end", async ({ conversationId }, callback) => {
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

            await endGroupCall(conversationId);

            const participants =
                getGroupCallParticipants(
                    conversationId
                );

            participants.forEach((userId) => {
                leaveGroupCall(
                    conversationId,
                    userId
                );
            });

            io.to(`group-call:${conversationId}`).emit(
                "group_call:ended",
                {
                    conversationId,
                }
            );

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
    });

    socket.on("group_call:leave", async ({ conversationId }, callback) => {
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

            leaveGroupCall(
                conversationId,
                socket.userId
            );

            socket.leave(
                `group-call:${conversationId}`
            );

            io.to(`group-call:${conversationId}`).emit(
                "group_call:user_left",
                {
                    userId: socket.userId,
                }
            );

            const participants =
                getGroupCallParticipants(
                    conversationId
                );

            if (participants.length === 0) {
                await endGroupCall(
                    conversationId
                );

                io.to(`group-call:${conversationId}`).emit(
                    "group_call:ended",
                    {
                        conversationId,
                    }
                );
            }

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
    });
}   