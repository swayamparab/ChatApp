"use client";

import { useParams } from "next/navigation";

import { useMessages } from "@/hooks/useMessages";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import MessageBubble from "./MessageBubble";


export default function MessageList() {

    const { conversationId } = useParams<{ conversationId: string; }>();

    const { data: currentUser } = useCurrentUser();

    const { data, isLoading, isError, } = useMessages(conversationId);

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
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-950 p-4">
            {data.messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={
                        message.sender.id === currentUser?.user.id
                    }
                />
            ))}
        </div>
    );
}