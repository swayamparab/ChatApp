"use client";

import { useEffect } from "react";

import { useSocket } from "./useSocket";

import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";

import type { Message, GetMessagesResponse, } from "@/types/message";

import type { GetConversationsResponse, } from "@/types/conversations";

export function useMessageEvents() {
    const { socket } = useSocket();

    const queryClient = useQueryClient();

    useEffect(() => {
        function handleNewMessage(message: Message) {
            // Update messages cache
            queryClient.setQueryData<GetMessagesResponse>(
                queryKeys.messages(message.conversationId),
                (old) => {
                    if (!old) {
                        return {
                            success: true,
                            messages: [message],
                        };
                    }

                    return {
                        ...old,
                        messages: [...old.messages, message],
                    };
                }
            );

            // Update conversations cache
            queryClient.setQueryData<GetConversationsResponse>(
                queryKeys.conversations,
                (old) => {
                    if (!old) {
                        return old;
                    }

                    const index = old.conversations.findIndex(
                        (conversation) =>
                            conversation.conversationId ===
                            message.conversationId
                    );

                    if (index === -1) {
                        return old;
                    }

                    const updatedConversation = {
                        ...old.conversations[index],
                        updatedAt: message.createdAt,
                        lastMessage: {
                            id: message.id,
                            content: message.content,
                            createdAt: message.createdAt,
                            sender: message.sender,
                        },
                    };

                    const conversations = [...old.conversations];

                    conversations.splice(index, 1);

                    conversations.unshift(updatedConversation);

                    return {
                        ...old,
                        conversations,
                    };
                }
            );
        }

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [socket, queryClient]);
}