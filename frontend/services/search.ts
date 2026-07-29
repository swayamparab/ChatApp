import { api } from "@/lib/api";
import { SearchMessagesResponse } from "@/types/search";

export async function searchMessages(
    conversationId: string,
    query: string
): Promise<SearchMessagesResponse> {
    
    const { data } = await api.get(`/conversations/${conversationId}/search`, {
        params: {
            q: query,
        },
    }
    );

    return data;
}