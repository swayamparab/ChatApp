import { api } from "@/lib/api";

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