import { useQuery } from "@tanstack/react-query";
import { getGroupInfo } from "@/services/groups";

export function useGroupInfo(groupId: string){
    return useQuery({
        queryKey: ["group", groupId],
        queryFn: ()=> getGroupInfo(groupId),
        enabled: !!groupId
    })
}