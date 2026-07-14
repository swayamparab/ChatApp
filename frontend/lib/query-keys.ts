export const queryKeys = {
  currentUser: ["currentUser"] as const,

  conversations: ["conversations"] as const,

  messages: (conversationId: string) =>
    ["messages", conversationId] as const,

  chatRequests: ["chat-requests"] as const,

  searchUsers: (query: string) =>
    ["search-users", query] as const,
};