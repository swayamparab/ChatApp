export interface Message {
    id: string;
    conversationId: string;

    type: "text" | "image" | "video" | "file" | "voice";

    content: string | null;

    attachmentUrl: string | null;
    attachmentName: string | null;
    attachmentMimeType: string | null;
    attachmentSize: number | null;

    createdAt: string;
    updatedAt: string;
    editedAt: string | null;

    sender: {
        id: string;
        username: string;
    };

    replyTo: {
        id: string;

        type: "text" | "image" | "video" | "file" | "voice";

        content: string | null;

        attachmentUrl: string | null;
        attachmentName: string | null;

        sender: {
            id: string;
            username: string;
        };
    } | null;
}

export type GetMessagesResponse = {
    success: boolean;
    messages: Message[];
    lastReadAt: string | null;

    nextCursor: string | null;
    hasMore: boolean;
};

export type UploadImageResponse = {
    success: boolean;

    attachmentUrl: string;

    attachmentMimeType: string;

    attachmentSize: number;

    attachmentPublicId: string;
};