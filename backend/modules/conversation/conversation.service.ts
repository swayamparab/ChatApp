import { db } from "../../db";
import { conversationParticipants, conversations, messages, users } from "../../db/schema";
import { and, count, eq, gt, ne, ilike, inArray } from "drizzle-orm";
import { AddMembersInput, CreateGroupInput, UpdateGroupInput } from "./conversation.validation";

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

          type: true,
          groupName: true,
          groupAvatar: true,
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

    const isGroup = conversation.type === "group";

    return {
      conversationId: conversation.id,

      type: conversation.type,

      updatedAt: conversation.updatedAt,

      otherUser: isGroup
        ? null
        : otherParticipant?.user ?? null,

      group: isGroup
        ? {
          name: conversation.groupName,
          avatar: conversation.groupAvatar,
          memberCount: conversation.participants.length,
        }
        : null,

      lastMessage: conversation.messages[0] ?? null,

      unreadCount:
        unreadMap.get(conversation.id) ?? 0,
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

export async function getConversationParticipantIds(
  conversationId: string
) {
  const participants =
    await db.query.conversationParticipants.findMany({
      where: eq(
        conversationParticipants.conversationId,
        conversationId
      ),
      columns: {
        userId: true,
      },
    });

  return participants.map((participant) => participant.userId);
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

export async function searchMessages(
  conversationId: string,
  userId: string,
  query: string
) {
  const search = query.trim();

  if (!search) {
    return [];
  }

  // Verify the user is part of this conversation
  const participant = await db.query.conversationParticipants.findFirst({
    where: and(
      eq(conversationParticipants.conversationId, conversationId),
      eq(conversationParticipants.userId, userId)
    ),
  });

  if (!participant) {
    throw new Error("Unauthorized");
  }

  const results = await db.query.messages.findMany({
    where: and(
      eq(messages.conversationId, conversationId),
      ilike(messages.content, `%${search}%`)
    ),

    columns: {
      id: true,
      content: true,
      senderId: true,
      createdAt: true,
      type: true,
    },

    orderBy: (messages, { desc }) => [
      desc(messages.createdAt),
    ],

    limit: 50,
  });

  return results;
}

export async function createGroup(creatorId: string, data: CreateGroupInput) {

  const memberIds = [
    ...new Set([
      creatorId,
      ...data.memberIds,
    ])
  ]

  const existingUsers = await db.select({
    id: users.id
  })
    .from(users)
    .where(
      inArray(users.id, memberIds)
    )

  if (existingUsers.length !== memberIds.length) {
    throw new Error("Some users do not exist.");
  }

  return await db.transaction(async (tx) => {
    const [conversation] = await tx
      .insert(conversations)
      .values({
        type: "group",
        groupName: data.name,
        createdBy: creatorId
      })
      .returning()

    await tx
      .insert(conversationParticipants)
      .values(
        memberIds.map((userId) => ({
          conversationId: conversation.id,
          userId
        }))
      )

    return conversation;

  })

}

export async function getGroupInfo(groupId: string, userId: string) {

  const participant =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, groupId),
        eq(conversationParticipants.userId, userId)
      ),
    });

  if (!participant) {
    throw new Error("Unauthorized");
  }

  const group = await db.query.conversations.findFirst({
    where: and(
      eq(conversations.id, groupId),
      eq(conversations.type, "group")
    ),

    with: {
      participants: {
        with: {
          user: {
            columns: {
              id: true,
              username: true,
              email: true,
              lastSeen: true,
            },
          },
        },
      },
    },
  });

  if (!group) {
    throw new Error("Group not found");
  }

  return {
    id: group.id,

    name: group.groupName,

    avatar: group.groupAvatar,

    createdBy: group.createdBy,

    members: group.participants.map((participant) => ({
      id: participant.user.id,

      username: participant.user.username,

      email: participant.user.email,

      lastSeen: participant.user.lastSeen,

      role: participant.role,
    })),
  };
}

export async function updateGroup(
  groupId: string,
  userId: string,
  data: UpdateGroupInput
) {
  const conversation =
    await db.query.conversations.findFirst({
      where: eq(conversations.id, groupId),
    });

  if (!conversation) {
    throw new Error("Group not found");
  }

  if (conversation.type !== "group") {
    throw new Error("Not a group");
  }

  const participant =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(
          conversationParticipants.conversationId,
          groupId
        ),
        eq(
          conversationParticipants.userId,
          userId
        )
      ),
    });

  if (!participant) {
    throw new Error("Unauthorized");
  }

  const isOwner =
    conversation.createdBy === userId;

  const isAdmin =
    participant.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new Error(
      "Only admins can rename the group."
    );
  }

  await db
    .update(conversations)
    .set({
      groupName: data.name,
    })
    .where(eq(conversations.id, groupId));

  return {
    id: conversation.id,
    groupName: data.name,
  };
}

export async function addMembers(
  groupId: string,
  userId: string,
  data: AddMembersInput
) {
  const conversation =
    await db.query.conversations.findFirst({
      where: eq(conversations.id, groupId),
    });

  if (!conversation) {
    throw new Error("Group not found");
  }

  if (conversation.type !== "group") {
    throw new Error("Not a group");
  }

  const participant =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(
          conversationParticipants.conversationId,
          groupId
        ),
        eq(
          conversationParticipants.userId,
          userId
        )
      ),
    });

  if (!participant) {
    throw new Error("Unauthorized");
  }

  if (participant.role !== "admin") {
    throw new Error(
      "Only admins can add members."
    );
  }

  const existingMembers =
    await db.query.conversationParticipants.findMany({
      where: eq(
        conversationParticipants.conversationId,
        groupId
      ),
      columns: {
        userId: true,
      },
    });

  const existingIds = new Set(
    existingMembers.map((member) => member.userId)
  );

  const newMemberIds = data.memberIds.filter(
    (id) => !existingIds.has(id)
  );

  if (newMemberIds.length === 0) {
    throw new Error(
      "All selected users are already members."
    );
  }

  const existingUsers = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(inArray(users.id, newMemberIds));

  if (existingUsers.length !== newMemberIds.length) {
    throw new Error(
      "One or more users do not exist."
    );
  }

  await db
    .insert(conversationParticipants)
    .values(
      newMemberIds.map((id) => ({
        conversationId: groupId,
        userId: id,
        role: "member" as const,
      }))
    );

  return await db.query.conversationParticipants.findMany({
    where: eq(
      conversationParticipants.conversationId,
      groupId
    ),
    with: {
      user: {
        columns: {
          id: true,
          username: true,
          email: true,
          lastSeen: true,
        },
      },
    },
  });
}

export async function removeMember(
  groupId: string,
  memberId: string,
  userId: string
) {
  const conversation =
    await db.query.conversations.findFirst({
      where: eq(conversations.id, groupId),
    });

  if (!conversation) {
    throw new Error("Group not found");
  }

  if (conversation.type !== "group") {
    throw new Error("Not a group");
  }

  const requester =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(
          conversationParticipants.conversationId,
          groupId
        ),
        eq(
          conversationParticipants.userId,
          userId
        )
      ),
    });

  if (!requester) {
    throw new Error("Unauthorized");
  }

  if (requester.role !== "admin") {
    throw new Error(
      "Only admins can remove members."
    );
  }

  if (memberId === userId) {
    throw new Error(
      "Use the leave group endpoint instead."
    );
  }

  const member =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(
          conversationParticipants.conversationId,
          groupId
        ),
        eq(
          conversationParticipants.userId,
          memberId
        )
      ),
    });

  if (!member) {
    throw new Error(
      "Member is not part of the group."
    );
  }

  await db
    .delete(conversationParticipants)
    .where(
      and(
        eq(
          conversationParticipants.conversationId,
          groupId
        ),
        eq(
          conversationParticipants.userId,
          memberId
        )
      )
    );
}

export async function promoteMember(
  groupId: string,
  memberId: string,
  userId: string
) {
  const requester =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, groupId),
        eq(conversationParticipants.userId, userId)
      ),
    });

  if (!requester) {
    throw new Error("Unauthorized");
  }

  if (requester.role !== "admin") {
    throw new Error("Only admins can promote members.");
  }

  const member =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, groupId),
        eq(conversationParticipants.userId, memberId)
      ),
    });

  if (!member) {
    throw new Error("Member not found.");
  }

  if (member.role === "admin") {
    throw new Error("User is already an admin.");
  }

  await db
    .update(conversationParticipants)
    .set({
      role: "admin",
    })
    .where(
      and(
        eq(conversationParticipants.conversationId, groupId),
        eq(conversationParticipants.userId, memberId)
      )
    );
}

export async function demoteAdmin(
  groupId: string,
  memberId: string,
  userId: string
) {
  const requester =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, groupId),
        eq(conversationParticipants.userId, userId)
      ),
    });

  if (!requester) {
    throw new Error("Unauthorized");
  }

  if (requester.role !== "admin") {
    throw new Error(
      "Only admins can demote admins."
    );
  }

  const member =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(conversationParticipants.conversationId, groupId),
        eq(conversationParticipants.userId, memberId)
      ),
    });

  if (!member) {
    throw new Error("Member not found.");
  }

  if (member.role !== "admin") {
    throw new Error(
      "User is already a member."
    );
  }

  const adminCount =
    await db.query.conversationParticipants.findMany({
      where: and(
        eq(
          conversationParticipants.conversationId,
          groupId
        ),
        eq(
          conversationParticipants.role,
          "admin"
        )
      ),
    });

  if (adminCount.length === 1) {
    throw new Error(
      "A group must have at least one admin."
    );
  }

  await db
    .update(conversationParticipants)
    .set({
      role: "member",
    })
    .where(
      and(
        eq(
          conversationParticipants.conversationId,
          groupId
        ),
        eq(
          conversationParticipants.userId,
          memberId
        )
      )
    );
}

export async function deleteGroup(
  groupId: string,
  userId: string
) {
  const conversation =
    await db.query.conversations.findFirst({
      where: eq(conversations.id, groupId),
    });

  if (!conversation) {
    throw new Error("Group not found.");
  }

  if (conversation.type !== "group") {
    throw new Error("Not a group.");
  }

  const requester =
    await db.query.conversationParticipants.findFirst({
      where: and(
        eq(
          conversationParticipants.conversationId,
          groupId
        ),
        eq(
          conversationParticipants.userId,
          userId
        )
      ),
    });

  if (!requester) {
    throw new Error("Unauthorized");
  }

  if (requester.role !== "admin") {
    throw new Error(
      "Only admins can delete the group."
    );
  }

  await db
    .delete(messages)
    .where(
      eq(messages.conversationId, groupId)
    );

  await db
    .delete(conversationParticipants)
    .where(
      eq(
        conversationParticipants.conversationId,
        groupId
      )
    );

  await db
    .delete(conversations)
    .where(
      eq(conversations.id, groupId)
    );
}