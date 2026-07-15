"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSocket } from "@/hooks/useSocket";
import { useRouter, useParams } from "next/navigation";

type ConversationItemProps = {
    conversationId: string;
    userId: string;
    username: string;
    lastMessage: string | null;
};

export default function ConversationItem({
    conversationId,
    userId,
    username,
    lastMessage,
}: ConversationItemProps) {
    const router = useRouter();

    const { conversationId: currentConversationId } = useParams<{
        conversationId?: string;
    }>();

    const isActive = currentConversationId === conversationId;

    const { onlineUsers } = useSocket();

    const isOnline = onlineUsers.includes(userId);

    return (
        <button
            onClick={() => router.push(`/chat/${conversationId}`)}
            className={`
                mx-2 my-1 flex w-[calc(100%-1rem)] items-center gap-3 rounded-2xl px-4 py-3
                text-left transition-all duration-200
                ${isActive
                    ? "bg-blue-500/10 shadow-md ring-1 ring-blue-500/30"
                    : "hover:bg-slate-800/70 hover:shadow-sm"
                }
            `}
        >
            <div className="relative">
                <Avatar className="h-11 w-11 ring-1 ring-slate-700/60">
                    <AvatarFallback className="bg-slate-700 font-semibold text-slate-100">
                        {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                {isOnline && (
                    <span
                        className="
                            absolute
                            bottom-0
                            right-0
                            h-3
                            w-3
                            rounded-full
                            border-2
                            border-slate-900
                            bg-emerald-500
                        "
                    />
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold tracking-tight text-white">
                    {username}
                </p>

                <p className="mt-0.5 truncate text-sm text-slate-400">
                    {lastMessage ?? "No messages yet"}
                </p>
            </div>
        </button>
    );
}