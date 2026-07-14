"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { acceptChatRequest, rejectChatRequest } from "@/services/chat-requests";
import { queryKeys } from "@/lib/query-keys";

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
        },
    });

    return (
        <div className="flex items-center justify-between border-b border-slate-800 py-3">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarFallback>
                        {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <p className="font-medium">
                        {username}
                    </p>

                    <p className="text-sm text-slate-400">
                        {email}
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    size="sm"
                    onClick={() => mutation.mutate(requestId)}
                >
                    Accept
                </Button>

                <Button
                    size="sm"
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