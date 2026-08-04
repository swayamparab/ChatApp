import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { leaveGroup, updateGroup } from "@/services/groups";
import { queryKeys } from "@/lib/query-keys";

export function useGroupActions() {
    const queryClient = useQueryClient();

    const router = useRouter();

    const leaveMutation = useMutation({
        mutationFn: leaveGroup,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.conversations,
            });

            router.replace("/chat");
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateGroup,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.groupInfo(
                    variables.groupId
                ),
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.conversations,
            });
        },
    });

    return {
        leaveGroup: leaveMutation.mutate,
        isLeaving: leaveMutation.isPending,

        updateGroup: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
    };
}