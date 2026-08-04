import { api } from "@/lib/api";
import { GetGroupInfoResponse } from "@/types/group";

export async function getGroupInfo(groupId: string) {
    const { data } = await api.get<GetGroupInfoResponse>(`/conversations/groups/${groupId}`);
    return data;
}