import { api } from "@/lib/api";
import { ChatRequestsResponse } from "@/types/chat-requests";

export async function getChatRequests() {
    const { data } = await api.get<ChatRequestsResponse>("/chat-requests");

    return data;
}

export async function sendChatRequest(receiverId: string) {
    const { data } = await api.post("/chat-requests", {
        receiverId,
    });

    return data;
}

export async function acceptChatRequest(requestId: string) {
    const { data } = await api.patch(`/chat-requests/${requestId}/accept`);

    return data;
}

export async function rejectChatRequest(requestId: string) {
    const { data } = await api.patch(`/chat-requests/${requestId}/reject`);

    return data;
}

export async function cancelChatRequest(requestId: string) {
    const { data } = await api.delete(`/chat-requests/${requestId}`);

    return data;
}