import { z } from "zod";

export const sendChatRequestSchema = z.object({
  receiverId: z.uuid(),
});

export type SendChatRequestInput = z.infer<
  typeof sendChatRequestSchema
>;

export const acceptChatRequestSchema = z.object({
  requestId: z.uuid(),
});

export type AcceptChatRequestInput = z.infer<
  typeof acceptChatRequestSchema
>;