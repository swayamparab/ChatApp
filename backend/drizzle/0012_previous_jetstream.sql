ALTER TYPE "public"."message_type" ADD VALUE 'video' BEFORE 'voice';--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "attachment_name" text;