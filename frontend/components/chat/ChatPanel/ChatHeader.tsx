"use client";

import { useParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";

import { useConversations } from "@/hooks/useConversations";

type ChatHeaderProps = {
    isTyping: boolean;
};

export default function ChatHeader({ isTyping }: ChatHeaderProps) {

    const { conversationId } = useParams<{ conversationId: string; }>();

    const { data, isLoading } = useConversations();

    const conversation = data?.conversations.find(
        (conversation) =>
            conversation.conversationId === conversationId
    );

    if (isLoading) {
        return (
            <header className="flex h-16 items-center border-b border-slate-800 bg-slate-900 px-4">
                <p className="text-slate-400">
                    Loading...
                </p>
            </header>
        );
    }

    if (!conversation) {
        return (
            <header className="flex h-16 items-center border-b border-slate-800 bg-slate-900 px-4">
                <p className="text-red-400">
                    Conversation not found
                </p>
            </header>
        );
    }



    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback>
                        {conversation.otherUser.username
                            .charAt(0)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <h2 className="font-medium">
                        {conversation.otherUser.username}
                    </h2>

                    <p
                        className={`text-sm ${isTyping
                                ? "text-green-400 animate-pulse"
                                : "text-slate-400"
                            }`}
                    >
                        {isTyping ? "Typing..." : "Online"}
                    </p>
                </div>
            </div>

            <button
                className="rounded-md p-2 transition-colors hover:bg-slate-800"
                aria-label="Conversation options"
            >
                <MoreVertical className="h-5 w-5 text-slate-400" />
            </button>
        </header>
    );
}