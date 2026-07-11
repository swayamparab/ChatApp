import { api } from "@/lib/api";

import type { GetMessagesResponse } from "@/types/message";

export async function getMessages(conversationId: string) {
    const response =
        await api.get<GetMessagesResponse>(`/conversations/${conversationId}/messages`);

    return response.data;
}