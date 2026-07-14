"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { acceptChatRequest, rejectChatRequest } from "@/services/chat-requests";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";

type IncomingRequestCardProps = {
    requestId: string;
    username: string;
    email: string;
};

export default function IncomingRequestCard({
    requestId,
    username,
    email,
}: IncomingRequestCardProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: acceptChatRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.chatRequests,
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.conversations,
            });

            queryClient.invalidateQueries({
                queryKey: ["search-users"],
            });

            toast.success("Chat request accepted!");
        },
    });

    const rejectMutation = useMutation({
        mutationFn: rejectChatRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.chatRequests,
            });

            queryClient.invalidateQueries({
                queryKey: ["search-users"],
            });

            toast.success("Chat request rejected.");
        },
    });

    return (
        <div
            className="
        mx-2 my-1
        flex items-center justify-between
        rounded-2xl
        px-4 py-3
        transition-all duration-200
        hover:bg-slate-800/70
        hover:shadow-sm
    "
        >
            <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-11 w-11 ring-1 ring-slate-700/60">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 font-semibold text-white">
                        {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold tracking-tight text-white">
                        {username}
                    </p>

                    <p className="truncate text-sm text-slate-400">
                        {email}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    className="rounded-full bg-emerald-600 px-4 hover:bg-emerald-500"
                    onClick={() => mutation.mutate(requestId)}
                >
                    Accept
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    className="
                        rounded-full
                        border-slate-700
                        bg-transparent
                        text-slate-300
                        hover:bg-red-500/10
                        hover:border-red-500/40
                        hover:text-red-400
                    "
                    onClick={() =>
                        rejectMutation.mutate(requestId)
                    }
                >
                    Reject
                </Button>
            </div>
        </div>
    );
}