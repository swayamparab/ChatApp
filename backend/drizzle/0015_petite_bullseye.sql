CREATE TYPE "public"."conversation_role" AS ENUM('admin', 'member');--> statement-breakpoint
ALTER TABLE "conversation-participants" ADD COLUMN "role" "conversation_role" DEFAULT 'member' NOT NULL;