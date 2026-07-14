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
            <header className="flex h-16 items-center bg-slate-900/95 px-5 shadow-sm">
                <p className="text-slate-400">
                    Loading...
                </p>
            </header>
        );
    }

    if (!conversation) {
        return (
            <header className="flex h-16 items-center bg-slate-900/95 px-5 shadow-sm">
                <p className="text-red-400">
                    Conversation not found
                </p>
            </header>
        );
    }

    return (
        <header className="flex h-16 items-center justify-between bg-slate-900/95 px-5 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    onClick={() => router.push("/chat")}
                    className="rounded-xl p-2 transition-all duration-200 hover:bg-slate-800 lg:hidden"
                    aria-label="Back"
                >
                    <ArrowLeft className="h-5 w-5 text-slate-300" />
                </button>

                <Avatar className="h-11 w-11 ring-1 ring-slate-700/60 shadow-sm">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 font-semibold text-white">
                        {conversation.otherUser.username
                            .charAt(0)
                            .toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <h2 className="truncate text-[15px] font-semibold tracking-tight text-white">
                        {conversation.otherUser.username}
                    </h2>

                    <div className="mt-0.5 flex items-center gap-2">
                        <span
                            className={`h-2 w-2 rounded-full ${isTyping
                                ? "bg-emerald-400 animate-pulse"
                                : "bg-emerald-500"
                                }`}
                        />

                        <p
                            className={`truncate text-sm ${isTyping
                                ? "text-emerald-400"
                                : "text-slate-400"
                                }`}
                        >
                            {isTyping ? "Typing..." : "Online"}
                        </p>
                    </div>
                </div>
            </div>

            <button
                className="
                rounded-xl
                p-2
                text-slate-400
                transition-all duration-200
                hover:bg-slate-800
                hover:text-white
            "
                aria-label="Conversation options"
            >
                <MoreVertical className="h-5 w-5" />
            </button>
        </header>
    );
}