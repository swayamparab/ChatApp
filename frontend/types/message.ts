export type Message = {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
    editedAt: string | null;

    sender: {
        id: string;
        username: string;
    };
};

export type GetMessagesResponse = {
    success: boolean;
    messages: Message[];
    lastReadAt: string | null;
};