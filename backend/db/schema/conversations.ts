import { pgTable, timestamp, uuid, pgEnum, text, } from "drizzle-orm/pg-core";

export const conversationTypeEnum = pgEnum(
  "conversation_type",
  [
    "direct",
    "group",
  ]
);

export const conversations = pgTable("conversations", {
  id: uuid().defaultRandom().primaryKey(),

  type: conversationTypeEnum()
    .default("direct")
    .notNull(),

  groupName: text("group_name"),

  groupAvatar: text("group_avatar"),

  createdBy: uuid("created_by"),

  createdAt: timestamp()
    .defaultNow()
    .notNull(),

  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});