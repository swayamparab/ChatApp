"use client";

import { useQuery } from "@tanstack/react-query";

import { getConversations } from "@/services/conversations";
import { queryKeys } from "@/lib/query-keys";

export function useConversations() {
    return useQuery({
        queryKey: queryKeys.conversations,
        queryFn: getConversations,
    });
}