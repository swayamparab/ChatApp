export type GroupMember = {
    id: string;
    username: string;
    email: string;
    lastSeen: string | null;
    role: "member" | "admin";
};

export type GroupInfo = {
    id: string;
    name: string;
    avatar: string | null;
    createdBy: string;
    members: GroupMember[];
};

export type GetGroupInfoResponse = {
    success: boolean;
    group: GroupInfo;
};