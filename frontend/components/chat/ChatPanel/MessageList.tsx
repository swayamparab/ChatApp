"use client";

import { useParams } from "next/navigation";

import { useMessages } from "@/hooks/useMessages";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";


export default function MessageList() {

    const { conversationId } = useParams<{ conversationId: string; }>();

    const { data: currentUser } = useCurrentUser();

    const { data, isLoading, isError, } = useMessages(conversationId);

    const bottomRef = useRef<HTMLDivElement>(null);

    //scroll auto to latest message when chat opens
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "auto",
        });
    }, [conversationId]);

    //scroll smooth as new message arrives
    const previousLengthRef = useRef(0);
    useEffect(() => {
        if (!data) return;

        const previousLength = previousLengthRef.current;
        const currentLength = data.messages.length;

        if (currentLength > previousLength && previousLength !== 0) {
            bottomRef.current?.scrollIntoView({
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

    return (
        <div
            className="
                flex flex-1 flex-col gap-3
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
                        message.sender.id === currentUser?.user.id
                    }
                />
            ))}

            <div ref={bottomRef} />
        </div>
    );
}