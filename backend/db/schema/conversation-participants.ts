import {
    pgTable,
    primaryKey,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { conversations } from "./conversations";
import { users } from "./users";

export const conversationParticipants = pgTable(
    "conversation-participants",
    {
        conversationId: uuid()
            .notNull()
            .references(() => conversations.id, {
                onDelete: "cascade",
            }),

        userId: uuid()
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        joinedAt: timestamp()
            .defaultNow()
            .notNull(),
        lastReadAt: timestamp()
            .defaultNow()
            .notNull()
    },
    (table) => ({
        pk: primaryKey({
            columns: [table.conversationId, table.userId],
        }),
    })
);