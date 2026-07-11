export type Conversation = {
    conversationId: string;
    otherUser: {
        id: string;
        username: string;
        email: string;
    };
};

export type GetConversationsResponse = {
    success: boolean;
    conversations: Conversation[];
};