"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendChatRequest } from "@/services/chat-requests";

import { useRouter } from "next/navigation";

type UserSearchCardProps = {
    id: string;
    username: string;
    email: string;
    relationship:
    | "none"
    | "pending_sent"
    | "pending_received"
    | "friends"
    conversationId: string | null
};

export default function UserSearchCard({
    id,
    username,
    email,
    relationship,
    conversationId
}: UserSearchCardProps) {

    const router = useRouter();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: sendChatRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["search-users"],
            });
        },
    });

    let actionButton;

    switch (relationship) {
        case "none":
            actionButton = (
                <Button
                    size="sm"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate(id)}
                >
                    {mutation.isPending
                        ? "Sending..."
                        : "Send Request"}
                </Button>
            );
            break;

        case "pending_sent":
            actionButton = (
                <Button
                    size="sm"
                    variant="secondary"
                    disabled
                >
                    Pending
                </Button>
            );
            break;

        case "pending_received":
            actionButton = (
                <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                >
                    Accept
                </Button>
            );
            break;
        case "friends":
            actionButton = (
                <Button
                    size="sm"
                    onClick={() => {
                        if (conversationId) {
                            router.push(`/chat/${conversationId}`);
                        }
                    }}
                >
                    Chat
                </Button>
            );
            break;
    }

    return (
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 hover:bg-slate-800/50">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-600 text-white">
                        {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                        {username}
                    </p>

                    <p className="truncate text-sm text-slate-400">
                        {email}
                    </p>
                </div>
            </div>

            {actionButton}
        </div>
    );
}