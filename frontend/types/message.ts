export type Message = {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;

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