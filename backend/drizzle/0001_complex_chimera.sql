CREATE TYPE "public"."chat-request-status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "chat-requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"senderId" uuid NOT NULL,
	"recieverId" uuid NOT NULL,
	"status" "chat-request-status" DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat-requests" ADD CONSTRAINT "chat-requests_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat-requests" ADD CONSTRAINT "chat-requests_recieverId_users_id_fk" FOREIGN KEY ("recieverId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;