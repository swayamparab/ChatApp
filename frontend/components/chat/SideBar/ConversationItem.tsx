"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

type ConversationItemProps = {
    conversationId: string;
    username: string;
    lastMessage: string | null;
};

export default function ConversationItem({
    conversationId,
    username,
    lastMessage,
}: ConversationItemProps) {

    const router = useRouter();

    const { conversationId: currentConversationId } = useParams<{ conversationId?: string; }>();

    const isActive = currentConversationId === conversationId;

    return (
        <button onClick={() => router.push(`/chat/${conversationId}`)}
            className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        border-b
                        border-slate-800
                        p-4
                        text-left
                        transition-colors
                        ${isActive
                    ? "bg-slate-800"
                    : "hover:bg-slate-800"
                }
            `}
        >
            <Avatar className="h-10 w-10">
                <AvatarFallback>
                    {username.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                    {username}
                </p>

                <p className="truncate text-sm text-slate-400">
                    {lastMessage ?? "No messages yet"}
                </p>
            </div>
        </button>
    );
}