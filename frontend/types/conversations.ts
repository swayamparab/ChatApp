export type Conversation = {
    conversationId: string;

    updatedAt: string;

    otherUser: {
        id: string;
        username: string;
        email: string;
    };

    lastMessage: {
        id: string;
        content: string;
        createdAt: string;

        sender: {
            id: string;
            username: string;
        };
    } | null;
};

export type GetConversationsResponse = {
    success: boolean;
    conversations: Conversation[];
};