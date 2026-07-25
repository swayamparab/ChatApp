import {
    pgTable,
    uuid,
    text,
    timestamp,
    foreignKey
} from "drizzle-orm/pg-core";

import { conversations } from "./conversations";
import { users } from "./users";

export const messages = pgTable(
    "messages",
    {
        id: uuid().defaultRandom().primaryKey(),

        conversationId: uuid()
            .notNull()
            .references(() => conversations.id, {
                onDelete: "cascade",
            }),

        senderId: uuid()
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        content: text().notNull(),

        replyToMessageId: uuid("reply_to_message_id"),

        createdAt: timestamp()
            .defaultNow()
            .notNull(),

        updatedAt: timestamp()
            .$onUpdate(() => new Date())
            .defaultNow()
            .notNull(),

        editedAt: timestamp(),
    },
    (table) => [
        foreignKey({
            columns: [table.replyToMessageId],
            foreignColumns: [table.id],
            name: "messages_reply_to_fk",
        }).onDelete("set null"),
    ]
);