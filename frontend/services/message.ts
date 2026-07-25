import { api } from "@/lib/api";

import type { GetMessagesResponse } from "@/types/message";

export async function getMessages(
    conversationId: string,
    before?: string | null,
    limit = 20
): Promise<GetMessagesResponse> {

    const response = await api.get(`/conversations/${conversationId}/messages`, {
        params: {
            before,
            limit,
        }
    });

    return response.data;
}