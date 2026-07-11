"use client";

import { useState } from "react";

import SearchBar from "./SearchBar";
import SidebarHeader from "./SidebarHeader";
import ConversationItem from "./ConversationItem";

import { useConversations } from "@/hooks/useConversations";

export default function Sidebar() {
    const [query, setQuery] = useState("");

    const {
        data,
        isLoading,
        isError,
    } = useConversations();

    return (
        <aside className="flex h-full flex-col border-r border-slate-800 bg-slate-900">
            <SidebarHeader />

            <SearchBar
                value={query}
                onValueChange={setQuery}
            />

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <p className="p-4 text-sm text-slate-400">
                        Loading conversations...
                    </p>
                ) : isError ? (
                    <p className="p-4 text-sm text-red-500">
                        Failed to load conversations.
                    </p>
                ) : data?.conversations.length === 0 ? (
                    <p className="p-4 text-sm text-slate-400">
                        No conversations yet.
                    </p>
                ) : (
                    data?.conversations.map((conversation) => (
                        <ConversationItem
                            key={conversation.conversationId}
                            conversationId={conversation.conversationId}
                            username={conversation.otherUser.username}
                            email={conversation.otherUser.email}
                        />
                    ))
                )}
            </div>
        </aside>
    );
}