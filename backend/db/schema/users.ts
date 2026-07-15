import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  username: varchar("username", { length: 30 }).notNull().unique(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: text("password").notNull(),

  lastSeen: timestamp("last_seen", {
    withTimezone: true,
  }),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});