"use client";

import { useEffect } from "react";

import { useSocket } from "./useSocket";

import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";

import type { Message, GetMessagesResponse, } from "@/types/message";

import type { GetConversationsResponse, } from "@/types/conversations";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export function useMessageEvents(activeConversationId?: string) {
    const { socket } = useSocket();

    const queryClient = useQueryClient();

    const { data: currentUser } = useCurrentUser();

    useEffect(() => {
        function handleNewMessage(message: Message) {

            const isOwnMessage =
                message.senderId === currentUser?.user.id;

            if (isOwnMessage) {
                queryClient.setQueryData<GetMessagesResponse>(
                    queryKeys.messages(message.conversationId),
                    (old) => {
                        if (!old) return old;

                        return {
                            ...old,
                            lastReadAt: null,
                        };
                    }
                );
            }

            const isActiveConversation =
                message.conversationId === activeConversationId;

            // Update messages cache
            queryClient.setQueryData<GetMessagesResponse>(
                queryKeys.messages(message.conversationId),
                (old) => {
                    if (!old) {
                        return old;
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

                    const conversation = old.conversations[index];

                    const updatedConversation = {
                        ...conversation,
                        updatedAt: message.createdAt,
                        lastMessage: {
                            id: message.id,
                            content: message.content,
                            createdAt: message.createdAt,
                            sender: message.sender,
                        },
                        unreadCount:
                            isOwnMessage || isActiveConversation
                                ? conversation.unreadCount
                                : conversation.unreadCount + 1,
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

        function handleMessageDeleted(data: {
            conversationId: string;
            messageId: string;
        }) {
            queryClient.setQueryData<GetMessagesResponse>(
                queryKeys.messages(data.conversationId),
                (old) => {
                    if (!old) {
                        return old;
                    }

                    const updatedMessages = old.messages.filter(
                        (message) => message.id !== data.messageId
                    );

                    updateConversationPreview(
                        data.conversationId,
                        updatedMessages
                    );

                    return {
                        ...old,
                        messages: updatedMessages,
                    };
                }
            );
        }

        function handleMessageEdited(message: Message) {
            queryClient.setQueryData<GetMessagesResponse>(
                queryKeys.messages(message.conversationId),
                (old) => {
                    if (!old) {
                        return old;
                    }

                    const updatedMessages = old.messages.map((m) =>
                        m.id === message.id ? message : m
                    );

                    updateConversationPreview(message.conversationId, updatedMessages);

                    return {
                        ...old,
                        messages: updatedMessages
                    }
                }
            )
        }

        function handleMessagesSeen(data: {
            conversationId: string;
            userId: string;
            lastReadAt: string;
        }) {
            queryClient.setQueryData<GetMessagesResponse>(
                queryKeys.messages(data.conversationId),
                (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        lastReadAt: data.lastReadAt,
                    };
                }
            );

            queryClient.setQueryData<GetConversationsResponse>(
                queryKeys.conversations,
                (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        conversations: old.conversations.map((conversation) =>
                            conversation.conversationId === data.conversationId
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

        function updateConversationPreview(
            conversationId: string,
            messages: Message[]
        ) {
            const lastMessage =
                messages.length > 0
                    ? messages[messages.length - 1]
                    : null;

            queryClient.setQueryData<GetConversationsResponse>(
                queryKeys.conversations,
                (old) => {
                    if (!old) {
                        return old;
                    }

                    const index = old.conversations.findIndex(
                        (conversation) =>
                            conversation.conversationId === conversationId
                    );

                    if (index === -1) {
                        return old;
                    }

                    const updatedConversation = {
                        ...old.conversations[index],
                        lastMessage,
                    };

                    const conversations = [...old.conversations];

                    conversations[index] = updatedConversation;

                    return {
                        ...old,
                        conversations,
                    };
                }
            );
        }

        socket.on("new_message", handleNewMessage);
        socket.on("message_deleted", handleMessageDeleted);
        socket.on("message_edited", handleMessageEdited);
        socket.on("messages_seen", handleMessagesSeen);

        return () => {
            socket.off("new_message", handleNewMessage);
            socket.off("message_deleted", handleMessageDeleted);
            socket.off("message_edited", handleMessageEdited);
            socket.off("messages_seen", handleMessagesSeen);
        };
    }, [socket, queryClient, activeConversationId, currentUser]);
}