import { useQuery } from "@tanstack/react-query";
import { getGroupInfo } from "@/services/groups";
import { queryKeys } from "@/lib/query-keys";

export function useGroupInfo(groupId: string) {
    return useQuery({
        queryKey: queryKeys.groupInfo(groupId),
        queryFn: () => getGroupInfo(groupId),
        enabled: !!groupId,
    });
}