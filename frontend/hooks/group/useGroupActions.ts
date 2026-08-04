import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { addMembers, createGroup, deleteGroup, leaveGroup, updateGroup } from "@/services/groups";
import { queryKeys } from "@/lib/query-keys";

export function useGroupActions() {
    const queryClient = useQueryClient();

    const router = useRouter();

    const createMutation = useMutation({
        mutationFn: createGroup,

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.conversations,
            });

            router.push(`/chat/${data.conversationId}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteGroup,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.conversations,
            });

            router.replace("/chat");
        },
    });

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

    const addMembersMutation = useMutation({
        mutationFn: addMembers,

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
        createGroup: createMutation.mutate,
        isCreatingGroup: createMutation.isPending,

        deleteGroup: deleteMutation.mutate,
        isDeletingGroup: deleteMutation.isPending,

        leaveGroup: leaveMutation.mutate,
        isLeaving: leaveMutation.isPending,

        updateGroup: updateMutation.mutate,
        isUpdating: updateMutation.isPending,

        addMembers: addMembersMutation.mutateAsync,
        isAddingMembers: addMembersMutation.isPending,
    };
}