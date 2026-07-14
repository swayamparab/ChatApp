import { useQuery } from "@tanstack/react-query";

import { getChatRequests } from "@/services/chat-requests";

export function useChatRequests() {
    return useQuery({
        queryKey: ["chat-requests"],
        queryFn: getChatRequests,
    });
}