import { chatRequests } from "../../db/schema/chat-requests";
import { conversations } from "../../db/schema/conversations";
import { conversationParticipants } from "../../db/schema/conversation-participants";
import { db } from "../../db";
import { findUserById } from "../users/user.service";
import { AcceptChatRequestInput, SendChatRequestInput } from "./chat-request.validation";
import { and, eq, or, inArray } from "drizzle-orm";
import { getConversationBetweenUsers } from "../conversation/conversation.service";

export async function sendChatRequest(senderId: string, data: SendChatRequestInput) {

  if (senderId === data.receiverId) {
    throw new Error("You cannot send a chat request to yourself")
  }

  const receiver = await findUserById(data.receiverId);

  if (!receiver) {
    throw new Error("User not found")
  }

  const existingConversation =
    await getConversationBetweenUsers(
      senderId,
      data.receiverId
    );

  if (existingConversation) {
    throw new Error(
      "You already have a conversation with this user"
    );
  }

  const pendingRequest = await db.query.chatRequests.findFirst({
    where: and(
      eq(chatRequests.status, "PENDING"),
      or(
        and(
          eq(chatRequests.senderId, senderId),
          eq(chatRequests.receiverId, data.receiverId)
        ),
        and(
          eq(chatRequests.senderId, data.receiverId),
          eq(chatRequests.receiverId, senderId)
        )
      )
    )
  });

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

export async function getChatRequests(userId: string) {
  const [incoming, outgoing] = await Promise.all([
    db.query.chatRequests.findMany({
      where: and(
        eq(chatRequests.receiverId, userId),
        eq(chatRequests.status, "PENDING")
      ),

      with: {
        sender: {
          columns: {
            id: true,
            username: true,
            email: true,
          },
        },
      },

      orderBy: (chatRequests, { desc }) => [
        desc(chatRequests.createdAt),
      ],
    }),

    db.query.chatRequests.findMany({
      where: and(
        eq(chatRequests.senderId, userId),
        eq(chatRequests.status, "PENDING")
      ),

      with: {
        receiver: {
          columns: {
            id: true,
            username: true,
            email: true,
          },
        },
      },

      orderBy: (chatRequests, { desc }) => [
        desc(chatRequests.createdAt),
      ],
    }),
  ]);

  return {
    incoming,
    outgoing,
    incomingCount: incoming.length,
    outgoingCount: outgoing.length,
  };
}

export async function getRelationshipStatus(currentUserId: string, searchUserIds: string[]) {
  if (searchUserIds.length === 0) {
    return new Map();
  }

  const requests = await db.query.chatRequests.findMany({
    where: and(
      eq(chatRequests.status, "PENDING"),
      or(
        and(
          eq(chatRequests.senderId, currentUserId),
          inArray(chatRequests.receiverId, searchUserIds)
        ),
        and(
          eq(chatRequests.receiverId, currentUserId),
          inArray(chatRequests.senderId, searchUserIds)
        )
      )
    )
  })

  const relationshipMap = new Map<string, {
    relationship: "pending_sent" | "pending_received";
    requestId: string
  }>

  for (const request of requests) {
    if (request.senderId === currentUserId) {
      relationshipMap.set(request.receiverId, {
        relationship: "pending_sent",
        requestId: request.id,
      });
    } else {
      relationshipMap.set(request.senderId, {
        relationship: "pending_received",
        requestId: request.id,
      });
    }
  }

  return relationshipMap;

}