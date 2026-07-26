CREATE TYPE "public"."message_type" AS ENUM('text', 'image', 'voice', 'file');--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "type" "message_type" DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "attachmentUrl" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "attachmentMimeType" text;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "attachmentSize" integer;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "duration" integer;