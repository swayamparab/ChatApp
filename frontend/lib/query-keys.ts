export const queryKeys = {
  currentUser: ["currentUser"] as const,

  conversations: ["conversations"] as const,

  messages: (conversationId: string) =>
    ["messages", conversationId] as const,
};