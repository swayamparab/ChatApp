export interface Message {
    id: string;
    conversationId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    editedAt: string | null;

    sender: {
        id: string;
        username: string;
    };

    replyTo: {
        id: string;
        content: string;

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