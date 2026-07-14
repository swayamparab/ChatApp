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

            <Button
                size="sm"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate(requestId)}
            >
                {mutation.isPending ? "Cancelling..." : "Cancel"}
            </Button>
        </div>
    );
}