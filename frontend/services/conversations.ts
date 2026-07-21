import { api } from "@/lib/api";
import { GetConversationsResponse } from "@/types/conversations";

export async function getConversations() {
    const response = await api.get<GetConversationsResponse>("/conversations");

    return response.data;
}