import { z } from "zod";

export const getMessagesSchema = z.object({
  conversationId: z.uuid(),
  before: z.uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type GetMessagesInput = z.infer<typeof getMessagesSchema>;

export const sendMessageSchema = z.object({
  conversationId: z.uuid(),
  content: z.string().trim().min(1).max(1000),
  replyToMessageId: z.uuid().optional(),
});
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const sendImageSchema = z.object({
  conversationId: z.uuid(),
  attachmentUrl: z.url(),
  attachmentPublicId: z.string(),
  attachmentMimeType: z.string(),
  attachmentSize: z.number().positive(),
  replyToMessageId: z.uuid().optional(),
});
export type SendImageInput = z.infer<typeof sendImageSchema>;

export type CreateMessageInput = {
  conversationId: string;

  content?: string;

  replyToMessageId?: string;

  type: "text" | "image";

  attachmentUrl?: string;

  attachmentPublicId?: string;

  attachmentMimeType?: string;

  attachmentSize?: number;
};

export const typingSchema = z.object({
  conversationId: z.uuid(),
});
export type TypingInput = z.infer<typeof typingSchema>;

export const deleteMessageSchema = z.object({
  messageId: z.uuid(),
})
export type deleteMessageInput = z.infer<typeof deleteMessageSchema>;

export const editMessageSchema = z.object({
  messageId: z.uuid(),
  content: z.string().trim().min(1, "Message cannot be empty").max(2000, "Message is too long"),
});

export type EditMessageInput = z.infer<typeof editMessageSchema>;