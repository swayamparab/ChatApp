import { api } from "@/lib/api";
import { GetConversationsResponse } from "@/types/conversations";

export async function getConversations() {
    const response = await api.get<GetConversationsResponse>("/conversations");

    return response.data;
}

export async function markConversationAsRead(
    conversationId: string
) {
    const response = await api.patch(`/conversations/${conversationId}/read`);

    return response.data;
}