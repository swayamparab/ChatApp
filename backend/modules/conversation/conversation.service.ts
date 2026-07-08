import { db } from "../../db";
import { conversationParticipants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getConversations(userId: string) {
  const conversations = await db.query.conversationParticipants.findMany({
    where: eq(conversationParticipants.userId, userId),

    with: {
      conversation: {
        with: {
          participants: {
            with: {
              user: {
                columns: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return conversations.map((conversation) => {
    const otherParticipant = conversation.conversation.participants.find(
      (participant) => participant.userId !== userId
    );

    return {
      conversationId: conversation.conversation.id,
      otherUser: otherParticipant?.user ?? null,
    };
  });
}