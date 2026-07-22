"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import { useMessages } from "@/hooks/useMessages";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import MessageBubble from "./MessageBubble";
import { useMarkConversationAsRead } from "@/hooks/useMarkConversationAsRead";
import { useSocket } from "@/hooks/useSocket";

export default function MessageList() {
    const { conversationId } = useParams<{
        conversationId: string;
    }>();

    const { data: currentUser } = useCurrentUser();

    const {
        data,
        isLoading,
        isError,
    } = useMessages(conversationId);


    const messagesContainerRef =
        useRef<HTMLDivElement>(null);

    const previousLengthRef = useRef(0);

    const { markConversationAsRead } = useMarkConversationAsRead();

    const lastMessage = data?.messages.at(-1);

    const { socket, isConnected } = useSocket();

    // Only mark as read if the latest message was sent by the other user.
    useEffect(() => {
        if (!isConnected) return;

        if (!conversationId || !currentUser || !lastMessage) {
            return;
        }

        if (lastMessage.senderId === currentUser.user.id) {
            return;
        }

        markConversationAsRead(conversationId);
    }, [
        isConnected,
        conversationId,
        currentUser,
        lastMessage?.id,
        markConversationAsRead,
    ]);

    // Scroll to bottom when opening a conversation
    useEffect(() => {
        if (!data) return;

        const id = setTimeout(() => {
            messagesContainerRef.current?.scrollTo({
                top: messagesContainerRef.current!.scrollHeight,
                behavior: "auto",
            });
        }, 0);

        return () => clearTimeout(id);
    }, [conversationId, data?.messages.length]);

    // Smooth scroll when a new message arrives
    useEffect(() => {
        if (!data) return;

        const previousLength =
            previousLengthRef.current;

        const currentLength =
            data.messages.length;

        if (
            currentLength > previousLength &&
            previousLength !== 0
        ) {
            messagesContainerRef.current?.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }

        previousLengthRef.current = currentLength;
    }, [data?.messages.length]);

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-slate-400">
                    Loading messages...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-red-400">
                    Failed to load messages.
                </p>
            </div>
        );
    }

    if (!data || data.messages.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-slate-400">
                    No messages yet.
                </p>
            </div>
        );
    }

    const lastOwnMessage = data.messages.findLast(
        (message) =>
            message.sender.id === currentUser?.user.id
    );

    return (
        <div
            ref={messagesContainerRef}
            className="
                flex flex-1 flex-col gap-3
                overflow-x-hidden
                overflow-y-auto
                bg-gradient-to-b
                from-slate-950
                to-[#030712]
                px-5
                py-4
            "
        >
            {data.messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={
                        message.sender.id ===
                        currentUser?.user.id
                    }
                    isLastOwnMessage={
                        message.id === lastOwnMessage?.id
                    }
                    lastReadAt={data.lastReadAt}
                />
            ))}
        </div>
    );
}