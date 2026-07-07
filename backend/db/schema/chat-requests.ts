import {
    pgTable,
    pgEnum,
    uuid,
    timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const chatRequestStatusEnum = pgEnum("chat-request-status", [
    "PENDING",
    "ACCEPTED",
    "REJECTED",
]);

export const chatRequests = pgTable("chat-requests", {
    id: uuid().defaultRandom().primaryKey(),

    senderId: uuid()
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade"
        }),

    receiverId: uuid()
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade"
        }),

    status: chatRequestStatusEnum()
        .notNull()
        .default("PENDING"),

    createdAt: timestamp()
        .defaultNow()
        .notNull(),

    updatedAt: timestamp()
        .$onUpdate(() => new Date())
        .defaultNow()
        .notNull(),

});