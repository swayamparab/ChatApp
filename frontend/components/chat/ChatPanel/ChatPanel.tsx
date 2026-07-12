"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { Message, GetMessagesResponse, } from "@/types/message";

import { useSocket } from "@/hooks/useSocket";

export default function ChatPanel() {

    const { conversationId } = useParams<{ conversationId: string; }>();

    const queryClient = useQueryClient();

    const { socket } = useSocket();

    useEffect(() => {
        if (!conversationId || !socket.connected) {
            return;
        }

        socket.emit("join_conversation",
            { conversationId },
            (response: { success: boolean; message?: string }) => {
                console.log(response);
            }
        );
    }, [conversationId, socket.connected]);

    useEffect(() => {
        function handleNewMessage(message: Message) {
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
        }

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [socket, queryClient]);

    return (
        <div className="flex h-full min-h-0 flex-col">
            <ChatHeader />

            <MessageList />

            <MessageInput />
        </div>
    );
}