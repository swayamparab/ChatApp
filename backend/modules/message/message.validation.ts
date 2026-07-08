import { z } from "zod";

export const getMessagesSchema = z.object({
  conversationId: z.uuid(),
});

export type GetMessagesInput = z.infer<
  typeof getMessagesSchema
>;