import { relations } from "drizzle-orm";

import { users } from "./users";
import { chatRequests } from "./chat-requests";
import { conversations } from "./conversations";
import { conversationParticipants } from "./conversation-participants";
import { messages } from "./messages";

//A conversation has many participants.
// One conversation has many messages.
export const conversationsRelations = relations(
    conversations,
    ({ many }) => ({
        participants: many(conversationParticipants),

        messages: many(messages)
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
// many messages
export const usersRelations = relations(users, ({ many }) => ({
    sentRequests: many(chatRequests, {
        relationName: "sender",
    }),

    receivedRequests: many(chatRequests, {
        relationName: "receiver",
    }),

    conversationParticipants: many(conversationParticipants),

    messages: many(messages)
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

//every message belongs to exactly ONE conversation.
//every message has exactly one sender.
export const messagesRelations = relations(messages, ({ one }) => ({
    conversation: one(conversations, {
        fields: [messages.conversationId],
        references: [conversations.id],
    }),

    sender: one(users, {
        fields: [messages.senderId],
        references: [users.id],
    }),
}));