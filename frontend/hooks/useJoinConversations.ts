"use client";

import { useEffect, useRef } from "react";

import { useSocket } from "./useSocket";
import { useConversations } from "./useConversations";

export function useJoinConversations() {
    const { socket } = useSocket();
    const { data } = useConversations();

    const joinedRoomsRef = useRef(new Set<string>());

    useEffect(() => {
        if (!socket.connected || !data) {
            return;
        }

        data.conversations.forEach((conversation) => {
            if (joinedRoomsRef.current.has(conversation.conversationId)) {
                return;
            }

            socket.emit(
                "join_conversation",
                {
                    conversationId: conversation.conversationId,
                },
                (response: {
                    success: boolean;
                    message?: string;
                }) => {
                    if (response.success) {
                        joinedRoomsRef.current.add(
                            conversation.conversationId
                        );
                    } else {
                        console.error(response.message);
                    }
                }
            );
        });
    }, [socket.connected, data, socket]);
}