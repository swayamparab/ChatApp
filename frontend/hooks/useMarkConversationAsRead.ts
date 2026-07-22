"use client";

import { useSocket } from "./useSocket";

import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { GetConversationsResponse } from "@/types/conversations";

export function useMarkConversationAsRead() {
    const { socket } = useSocket();

    const queryClient = useQueryClient();

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
                    return;
                }

                queryClient.setQueryData<GetConversationsResponse>(
                    queryKeys.conversations,
                    (old) => {
                        if (!old) return old;

                        return {
                            ...old,
                            conversations: old.conversations.map((conversation) =>
                                conversation.conversationId === conversationId
                                    ? {
                                        ...conversation,
                                        unreadCount: 0,
                                    }
                                    : conversation
                            ),
                        };
                    }
                );
            }
        );
    }

    return {
        markConversationAsRead,
    };
}