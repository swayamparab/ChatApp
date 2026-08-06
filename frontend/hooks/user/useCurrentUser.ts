"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth";
import { queryKeys } from "@/lib/query-keys";

export function useCurrentUser() {
    return useQuery({
        queryKey: queryKeys.currentUser,
        queryFn: getCurrentUser,
        retry: false
    });
}