"use client";

import { useQuery } from "@tanstack/react-query";

import { getMessages } from "@/services/message";
import { queryKeys } from "@/lib/query-keys";

export function useMessages(conversationId: string) {
    return useQuery({
        queryKey: queryKeys.messages(conversationId),
        queryFn: () => getMessages(conversationId),
        enabled: !!conversationId,
    });
}