export const onlineUsers = new Map<string, string>();

export function getOnlineUserIds() {
    return Array.from(onlineUsers.keys());
}