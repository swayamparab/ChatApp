import { relations } from "drizzle-orm";

import { users } from "./users";
import { chatRequests } from "./chat-requests";
import { conversations } from "./conversations";
import { conversationParticipants } from "./conversation-participants";

//A conversation has many participants.
export const conversationsRelations = relations(
    conversations,
    ({ many }) => ({
        participants: many(conversationParticipants),
    })
);
//A participant belongs to one conversation.
export const conversationParticipantsRelations = relations(
    conversationParticipants,
    ({ one }) => ({
        conversation: one(conversations, {
            fields: [conversationParticipants.conversationId],
            references: [conversations.id],
        }),

        user: one(users, {
            fields: [conversationParticipants.userId],
            references: [users.id],
        }),
    })
);

//A user has:
// many sent requests
// many received requests
// many conversation participations
export const usersRelations = relations(users, ({ many }) => ({
    sentRequests: many(chatRequests, {
        relationName: "sender",
    }),

    receivedRequests: many(chatRequests, {
        relationName: "receiver",
    }),

    conversationParticipants: many(conversationParticipants),
}));

// Each chat request belongs to:
// one sender
// one receiver
export const chatRequestsRelations = relations(
    chatRequests,
    ({ one }) => ({
        sender: one(users, {
            fields: [chatRequests.senderId],
            references: [users.id],
            relationName: "sender",
        }),

        receiver: one(users, {
            fields: [chatRequests.receiverId],
            references: [users.id],
            relationName: "receiver",
        }),
    })
);