import { db } from "../../db";
import { conversationParticipants, messages } from "../../db/schema";
import { and, count, eq, gt, ne } from "drizzle-orm";

export async function getConversations(userId: string) {
  const userConversations = await db.query.conversationParticipants.findMany({
    where: eq(conversationParticipants.userId, userId),

    columns: {
      lastReadAt: true
    },

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

  const unreadCounts = await db
    .select({
      conversationId: messages.conversationId,
      unreadCount: count(),
    })
    .from(messages)
    .innerJoin(
      conversationParticipants,
      and(
        eq(
          messages.conversationId,
          conversationParticipants.conversationId
        ),
        eq(
          conversationParticipants.userId,
          userId
        )
      )
    )
    .where(
      and(
        gt(
          messages.createdAt,
          conversationParticipants.lastReadAt
        ),
        ne(messages.senderId, userId)
      )
    )
    .groupBy(messages.conversationId);

  const unreadMap = new Map(
    unreadCounts.map((item) => [
      item.conversationId,
      Number(item.unreadCount),
    ])
  );

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
      unreadCount: unreadMap.get(conversation.id) ?? 0
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

export async function markConversationAsRead(
  conversationId: string,
  userId: string
) {
  const participant =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      ),
    });

  if (!participant) {
    throw new Error("Conversation not found");
  }

  const lastReadAt = new Date();

  await db
    .update(conversationParticipants)
    .set({
      lastReadAt,
    })
    .where(
      and(
        eq(conversationParticipants.conversationId, conversationId),
        eq(conversationParticipants.userId, userId)
      )
    );

  return lastReadAt;
}