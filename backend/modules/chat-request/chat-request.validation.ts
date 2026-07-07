import { z } from "zod";

export const sendChatRequestSchema = z.object({
  receiverId: z.uuid(),
});

export type SendChatRequestInput = z.infer<
  typeof sendChatRequestSchema
>;