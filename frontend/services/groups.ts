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

export async function addMembers(data: { groupId: string; memberIds: string[]; }) {
    const response = await api.patch(`/conversations/groups/${data.groupId}/members`,
        {
            memberIds: data.memberIds,
        }
    );

    return response.data;
}

export type CreateGroupPayload = {
    name: string;
    memberIds: string[];
};

export type CreateGroupResponse = {
    success: boolean;
    conversationId: string;
};

export async function createGroup(
    data: CreateGroupPayload
): Promise<CreateGroupResponse> {
    const response = await api.post<CreateGroupResponse>("/conversations/groups", data);

    return response.data;
}

export async function deleteGroup(groupId: string) {
    await api.delete(`/conversations/groups/${groupId}`);
}

export async function removeMember(groupId: string, memberId: string) {
    const { data } = await api.delete(
        `/conversations/groups/${groupId}/members/${memberId}`
    );

    return data;
}

export async function promoteMember(groupId: string, memberId: string) {
    const { data } = await api.patch(
        `/conversations/groups/${groupId}/members/${memberId}/promote`
    );

    return data;
}

export async function demoteAdmin(groupId: string, memberId: string) {
    const { data } = await api.patch(
        `/conversations/groups/${groupId}/members/${memberId}/demote`
    );

    return data;
}