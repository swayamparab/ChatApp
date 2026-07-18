"use client";

import ConversationItem from "../ConversationItem";
import { useConversations } from "@/hooks/useConversations";

export default function ConversationList() {
    const {
        data,
        isLoading,
        isError,
    } = useConversations();

    if (isLoading) {
        return (
            <p className="p-4 text-sm text-slate-400">
                Loading conversations...
            </p>
        );
    }

    if (isError) {
        return (
            <p className="p-4 text-sm text-red-500">
                Failed to load conversations.
            </p>
        );
    }

    if (!data || data.conversations.length === 0) {
        return (
            <p className="p-4 text-sm text-slate-400">
                No conversations yet.
            </p>
        );
    }

    return (
        <>
            {data.conversations.map((conversation) => (
                <ConversationItem
                    key={conversation.conversationId}
                    conversationId={conversation.conversationId}
                    userId={conversation.otherUser.id}
                    username={conversation.otherUser.username}
                    lastMessage={
                        conversation.lastMessage?.content ?? null
                    }
                    unreadCount={
                        conversation.unreadCount ?? null
                    }
                />
            ))}
        </>
    );
}