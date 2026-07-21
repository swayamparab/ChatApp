"use client";

import { useSocket } from "./useSocket";

export function useMarkConversationAsRead() {
    const { socket } = useSocket();

    function markConversationAsRead(conversationId: string) {
        socket.emit(
            "mark_conversation_read",
            { conversationId },
            (response: {
                success: boolean;
                message?: string;
            }) => {
                if (!response.success) {
                    console.error(response.message);
                }
            }
        );
    }

    return {
        markConversationAsRead,
    };
}