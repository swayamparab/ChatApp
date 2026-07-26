import { api } from "@/lib/api";

import type { GetMessagesResponse, UploadImageResponse } from "@/types/message";

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

export async function uploadImage(
    file: File
): Promise<UploadImageResponse> {
    const formData = new FormData();

    formData.append("image", file);

    const { data } = await api.post<UploadImageResponse>(
        "/conversations/upload/image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
}