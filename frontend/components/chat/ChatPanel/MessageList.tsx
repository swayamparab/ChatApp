"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import { useMessages } from "@/hooks/useMessages";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import MessageBubble from "./MessageBubble";
import { useMarkConversationAsRead } from "@/hooks/useMarkConversationAsRead";
import { useSocket } from "@/hooks/useSocket";

import type { Message } from "@/types/message";
interface MessageListProps {
    onReply: (message: Message) => void;
}

export default function MessageList({
    onReply,
}: MessageListProps) {
    const { conversationId } = useParams<{
        conversationId: string;
    }>();

    const { data: currentUser } = useCurrentUser();

    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMessages(conversationId);

    const messages =
        data?.pages
            .slice()
            .reverse()
            .flatMap((page) => page.messages) ?? [];

    const lastReadAt =
        data?.pages[0]?.lastReadAt ?? null;

    const messagesContainerRef =
        useRef<HTMLDivElement>(null);

    const previousLengthRef = useRef(0);

    const { markConversationAsRead } = useMarkConversationAsRead();

    const lastMessage = messages.at(-1);

    const { socket, isConnected } = useSocket();

    const previousScrollHeightRef = useRef(0);
    const loadingMoreRef = useRef(false);
    const initialScrollDoneRef = useRef(false);

    useEffect(() => {
        initialScrollDoneRef.current = false;
    }, [conversationId]);

    const handleScroll = () => {
        if (!messagesContainerRef.current) return;

        console.log({
            scrollTop: messagesContainerRef.current.scrollTop,
            hasNextPage,
            isFetchingNextPage,
            loadingMore: loadingMoreRef.current,
        });

        if (
            messagesContainerRef.current.scrollTop <= 50 &&
            hasNextPage &&
            !isFetchingNextPage &&
            !loadingMoreRef.current
        ) {
            console.log("FETCH NEXT PAGE");

            loadingMoreRef.current = true;

            previousScrollHeightRef.current =
                messagesContainerRef.current.scrollHeight;

            fetchNextPage();
        }
    };

    // Only mark as read if the latest message was sent by the other user.
    useEffect(() => {
        if (!isConnected) return;

        if (!conversationId || !currentUser || !lastMessage) {
            return;
        }

        if (lastMessage.sender.id === currentUser.user.id) {
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

        if (initialScrollDoneRef.current) return;

        const id = setTimeout(() => {
            messagesContainerRef.current?.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "auto",
            });

            initialScrollDoneRef.current = true;
        }, 0);

        return () => clearTimeout(id);
    }, [data, conversationId]);

    // Smooth scroll when a new message arrives
    useEffect(() => {
        if (!data) return;

        const previousLength =
            previousLengthRef.current;

        const currentLength =
            messages.length;

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
    }, [messages.length]);

    // scroll restoration effect
    useEffect(() => {
        if (
            !loadingMoreRef.current ||
            !messagesContainerRef.current
        ) {
            return;
        }

        const newScrollHeight =
            messagesContainerRef.current.scrollHeight;

        const heightDifference =
            newScrollHeight -
            previousScrollHeightRef.current;

        messagesContainerRef.current.scrollTop +=
            heightDifference;

        loadingMoreRef.current = false;
    }, [messages.length]);

    useEffect(() => {
        function handleImageLoaded() {
            messagesContainerRef.current?.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "auto",
            });
        }

        window.addEventListener("message-image-loaded", handleImageLoaded);

        return () =>
            window.removeEventListener("message-image-loaded", handleImageLoaded);
    }, []);

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

    if (!data || messages.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-slate-400">
                    No messages yet.
                </p>
            </div>
        );
    }

    const lastOwnMessage = messages.findLast(
        (message) =>
            message.sender.id === currentUser?.user.id
    );

    return (
        <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
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
            {isFetchingNextPage && (
                <div className="py-2 text-center text-sm text-slate-400">
                    Loading older messages...
                </div>
            )}
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                    onReply={onReply}
                    isOwnMessage={
                        message.sender.id ===
                        currentUser?.user.id
                    }
                    isLastOwnMessage={
                        message.id === lastOwnMessage?.id
                    }
                    lastReadAt={lastReadAt}
                />
            ))}
        </div>
    );
}