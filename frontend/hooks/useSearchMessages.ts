import { useQuery } from "@tanstack/react-query";

import { searchMessages } from "@/services/search";

export function useSearchMessages(
    conversationId: string,
    query: string
) {
    return useQuery({
        queryKey: ["message-search", conversationId, query],

        queryFn: () =>
            searchMessages(conversationId, query),

        enabled: query.trim().length > 0,
    });
}