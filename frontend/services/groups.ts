import { api } from "@/lib/api";
import { GetGroupInfoResponse } from "@/types/group";

export async function getGroupInfo(groupId: string) {
    const { data } = await api.get<GetGroupInfoResponse>(`/conversations/groups/${groupId}`);

    return data;
}

export async function leaveGroup(groupId: string) {
    const { data } = await api.delete(`/conversations/groups/${groupId}/leave`);

    return data;
}

type UpdateGroupInput = {
    groupId: string;
    name: string;
};
export async function updateGroup({ groupId, name }: UpdateGroupInput) {
    const { data } = await api.patch(`/conversations/groups/${groupId}`, {
        name
    })

    return data;
}