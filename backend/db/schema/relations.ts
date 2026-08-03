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
    ({ many, one }) => ({
        participants: many(conversationParticipants),

        messages: many(messages),

        creator: one(users, {
            fields: [conversations.createdBy],
            references: [users.id],
        }),
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

    messages: many(messages),

    createdGroups: many(conversations),
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
//a message can reply to one message
//a message can have many replies
export const messagesRelations = relations(
    messages,
    ({ one, many }) => ({
        conversation: one(conversations, {
            fields: [messages.conversationId],
            references: [conversations.id],
        }),

        sender: one(users, {
            fields: [messages.senderId],
            references: [users.id],
        }),

        replyTo: one(messages, {
            fields: [messages.replyToMessageId],
            references: [messages.id],
            relationName: "messageReplies",
        }),

        replies: many(messages, {
            relationName: "messageReplies",
        }),
    })
);