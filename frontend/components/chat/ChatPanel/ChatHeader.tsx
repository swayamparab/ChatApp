"use client";

import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical } from "lucide-react";
import { ArrowLeft } from "lucide-react";

import { useConversations } from "@/hooks/useConversations";

type ChatHeaderProps = {
    isTyping: boolean;
};

export default function ChatHeader({ isTyping }: ChatHeaderProps) {

    const router = useRouter();

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
            <div className="flex min-w-0 items-center gap-2">
                <button
                    onClick={() => router.push("/chat")}
                    className="rounded-full p-2 transition-colors hover:bg-slate-800 lg:hidden"
                    aria-label="Back"
                >
                    <ArrowLeft className="h-5 w-5 text-slate-300" />
                </button>

                <Avatar className="h-10 w-10">
                    <AvatarFallback>
                        {conversation.otherUser.username
                            .charAt(0)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <h2 className="truncate font-medium">
                        {conversation.otherUser.username}
                    </h2>

                    <p
                        className={`truncate text-sm ${isTyping
                            ? "animate-pulse text-green-400"
                            : "text-slate-400"
                            }`}
                    >
                        {isTyping ? "Typing..." : "Online"}
                    </p>
                </div>
            </div>

            <button
                className="rounded-full p-2 transition-colors hover:bg-slate-800"
                aria-label="Conversation options"
            >
                <MoreVertical className="h-5 w-5 text-slate-400" />
            </button>
        </header>
    );
}