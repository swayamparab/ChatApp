"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query-keys";
import { cancelChatRequest } from "@/services/chat-requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
    username: string;
    email: string;
    requestId: string;
};

export default function OutgoingRequestCard({
    username,
    email,
    requestId
}: Props) {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: cancelChatRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.chatRequests,
            });

            queryClient.invalidateQueries({
                queryKey: ["search-users"],
            });

            toast.success("Chat request deleted!");
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

            <Button
                size="sm"
                variant="outline"
                disabled={mutation.isPending}
                className="
                    rounded-full
                    border-slate-700
                    bg-transparent
                    px-4
                    text-slate-300
                    transition-colors
                    hover:border-red-500/40
                    hover:bg-red-500/10
                    hover:text-red-400
                "
                onClick={() => mutation.mutate(requestId)}
            >
                {mutation.isPending ? "Cancelling..." : "Cancel"}
            </Button>
        </div>
    );
}