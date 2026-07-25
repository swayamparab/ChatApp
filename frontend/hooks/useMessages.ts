"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getMessages } from "@/services/message";
import { queryKeys } from "@/lib/query-keys";

export function useMessages(conversationId: string) {
    return useInfiniteQuery({
        queryKey: queryKeys.messages(conversationId),

        queryFn: ({ pageParam }) => getMessages(conversationId, pageParam),

        initialPageParam: null as string | null,

        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? lastPage.nextCursor : undefined,

        enabled: !!conversationId,
    });
}