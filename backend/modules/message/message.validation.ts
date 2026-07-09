import { z } from "zod";

export const getMessagesSchema = z.object({
  conversationId: z.uuid(),
});

export type GetMessagesInput = z.infer<
  typeof getMessagesSchema
>;

export const sendMessageSchema = z.object({
  conversationId: z.uuid(),
  content: z.string().trim().min(1).max(1000),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const typingSchema = z.object({
    conversationId: z.uuid(),
});

export type TypingInput = z.infer<typeof typingSchema>;