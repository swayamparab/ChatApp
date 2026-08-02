import {
    pgTable,
    uuid,
    text,
    timestamp,
    foreignKey,
    pgEnum,
    integer,
    json,
} from "drizzle-orm/pg-core";

import { conversations } from "./conversations";
import { users } from "./users";

export const messageTypeEnum = pgEnum("message_type", [
    "text",
    "image",
    "video",
    "voice",
    "file",
]);

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

        type: messageTypeEnum()
            .default("text")
            .notNull(),

        content: text(),

        attachmentUrl: text("attachment_url"),

        attachmentPublicId: text("attachment_public_id"),

        attachmentMimeType: text("attachment_mime_type"),

        attachmentName: text("attachment_name"),

        attachmentSize: integer("attachment_size"),

        duration: integer(),

        waveform: json().$type<number[]>(),

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