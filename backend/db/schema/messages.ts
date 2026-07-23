import {
    pgTable,
    uuid,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

import { conversations } from "./conversations";
import { users } from "./users";

export const messages = pgTable("messages", {
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

    createdAt: timestamp()
        .defaultNow()
        .notNull(),

    updatedAt: timestamp()
        .$onUpdate(() => new Date())
        .defaultNow()
        .notNull(),
    editedAt: timestamp(),
});