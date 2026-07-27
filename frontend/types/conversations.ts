export type Conversation = {
    conversationId: string;

    updatedAt: string;

    otherUser: {
        id: string;
        username: string;
        email: string;
        lastSeen: string | null;
    };

    lastMessage: {
        id: string;

        type: "text" | "image" | "video" | "file";

        content: string | null;

        attachmentUrl: string | null;

        createdAt: string;

        sender: {
            id: string;
            username: string;
        };
    } | null;

    unreadCount: number;
};

export type GetConversationsResponse = {
    success: boolean;
    conversations: Conversation[];
};