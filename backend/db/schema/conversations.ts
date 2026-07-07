import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const conversations = pgTable("conversations", {
  id: uuid().defaultRandom().primaryKey(),

  createdAt: timestamp().defaultNow().notNull(),

  updatedAt: timestamp()
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});