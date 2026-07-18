import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markConversationAsRead } from "@/services/conversations";
import { queryKeys } from "@/lib/query-keys";

export function useMarkConversationAsRead() {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markConversationAsRead,

        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: queryKeys.conversations
            })
        }
    });
}