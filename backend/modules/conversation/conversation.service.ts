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
                    lastSeen: true
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

export async function getConversationBetweenUsers(
  userOneId: string,
  userTwoId: string
) {
  const userConversations =
    await db.query.conversationParticipants.findMany({
      where: eq(conversationParticipants.userId, userOneId),

      with: {
        conversation: {
          columns: {
            id: true,
          },

          with: {
            participants: {
              columns: {
                userId: true,
              },
            },
          },
        },
      },
    });

  for (const participant of userConversations) {
    const hasOtherUser =
      participant.conversation.participants.some(
        (p) => p.userId === userTwoId
      );

    if (hasOtherUser) {
      return participant.conversation;
    }
  }

  return null;
}

export async function getExistingConversations(
  currentUserId: string,
  searchedUserIds: string[]
) {
  if (searchedUserIds.length === 0) {
    return new Map<
      string,
      {
        conversationId: string;
      }
    >();
  }

  const currentUserParticipations =
    await db.query.conversationParticipants.findMany({
      where: eq(conversationParticipants.userId, currentUserId),

      with: {
        conversation: {
          columns: {
            id: true,
          },

          with: {
            participants: {
              columns: {
                userId: true,
              },
            },
          },
        },
      },
    });

  const conversationMap = new Map<
    string,
    {
      conversationId: string;
    }
  >();

  for (const participation of currentUserParticipations) {
    const otherParticipant =
      participation.conversation.participants.find(
        (participant) =>
          participant.userId !== currentUserId &&
          searchedUserIds.includes(participant.userId)
      );

    if (!otherParticipant) {
      continue;
    }

    conversationMap.set(otherParticipant.userId, {
      conversationId: participation.conversation.id,
    });
  }

  return conversationMap;
}