export type Conversation = {
    conversationId: string;

    type: "direct" | "group";

    updatedAt: string;

    otherUser: {
        id: string;
        username: string;
        email: string;
        lastSeen: string | null;
    } | null;

    group: {
        name: string;
        avatar: string | null;
        memberCount: number;
    } | null;

    lastMessage: {
        id: string;

        type: "text" | "image" | "video" | "file" | "voice";

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