import { chatRequests } from "../../db/schema/chat-requests";
import { conversations } from "../../db/schema/conversations";
import { conversationParticipants } from "../../db/schema/conversation-participants";
import { db } from "../../db";
import { findUserById } from "../users/user.service";
import { AcceptChatRequestInput, SendChatRequestInput } from "./chat-request.validation";
import { and, eq } from "drizzle-orm";

export async function sendChatRequest(senderId: string, data: SendChatRequestInput) {

    if (senderId === data.receiverId) {
        throw new Error("You cannot send a chat request to yourself")
    }

    const receiver = await findUserById(data.receiverId);

    if (!receiver) {
        throw new Error("User not found")
    }

    const pendingRequest = await db.query.chatRequests.findFirst({
        where: and(
            eq(chatRequests.senderId, senderId),
            eq(chatRequests.receiverId, data.receiverId),
            eq(chatRequests.status, "PENDING")
        )
    })

    if (pendingRequest) {
        throw new Error("Chat request already sent");
    }

    const [chatRequest] = await db.insert(chatRequests)
        .values({
            senderId,
            receiverId: data.receiverId
        })
        .returning()

    return chatRequest;

}

export async function acceptChatRequest(
  userId: string,
  data: AcceptChatRequestInput
) {
  const request = await db.query.chatRequests.findFirst({
    where: eq(chatRequests.id, data.requestId),
  });

  if (!request) {
    throw new Error("Chat request not found");
  }

  if (request.receiverId !== userId) {
    throw new Error("You are not authorized to accept this request");
  }

  if (request.status !== "PENDING") {
    throw new Error("Chat request already handled");
  }

  const conversation = await db.transaction(async (tx) => {
    await tx
      .update(chatRequests)
      .set({
        status: "ACCEPTED",
      })
      .where(eq(chatRequests.id, request.id));

    const [conversation] = await tx
      .insert(conversations)
      .values({})
      .returning();

    await tx.insert(conversationParticipants).values([
      {
        conversationId: conversation.id,
        userId: request.senderId,
      },
      {
        conversationId: conversation.id,
        userId: request.receiverId,
      },
    ]);

    return conversation;
  });

  return conversation;
}