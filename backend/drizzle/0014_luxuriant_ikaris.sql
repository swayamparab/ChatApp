CREATE TYPE "public"."conversation_type" AS ENUM('direct', 'group');--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "type" "conversation_type" DEFAULT 'direct' NOT NULL;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "group_name" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "group_avatar" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "created_by" uuid;