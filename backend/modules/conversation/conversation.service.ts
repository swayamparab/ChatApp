import { db } from "../../db";
import { conversationParticipants } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export async function getConversations(userId: string) {
  const userConversations =
    await db.query.conversationParticipants.findMany({
      where: eq(conversationParticipants.userId, userId),

      with: {
        conversation: {
          columns: {
            id: true,
            updatedAt: true,
          },

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

            messages: {
              orderBy: (messages, { desc }) => [
                desc(messages.createdAt),
              ],
              limit: 1,
              with: {
                sender: {
                  columns: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  const conversations = userConversations.map((participant) => {
    const conversation = participant.conversation;

    const otherParticipant = conversation.participants.find(
      (participant) => participant.userId !== userId
    );

    return {
      conversationId: conversation.id,
      updatedAt: conversation.updatedAt,
      otherUser: otherParticipant?.user ?? null,
      lastMessage: conversation.messages[0] ?? null,
    };
  });

  conversations.sort(
    (a, b) =>
      b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return conversations;
}

export async function isParticipant(
  userId: string,
  conversationId: string
) {
  const participant = await db.query.conversationParticipants.findFirst({
    where: and(
      eq(conversationParticipants.userId, userId),
      eq(
        conversationParticipants.conversationId,
        conversationId
      )
    ),
  });

  return !!participant;
}