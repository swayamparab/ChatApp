export type Relationship =
    | "none"
    | "pending_sent"
    | "pending_received"
    | "friends"

export type SearchUser = {
    id: string;
    username: string;
    email: string;
    relationship: Relationship;
    requestId: string | null;
    conversationId: string | null
};

export type SearchUsersResponse = {
    success: boolean;
    users: SearchUser[];
};