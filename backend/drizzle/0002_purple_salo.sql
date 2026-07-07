ALTER TABLE "chat-requests" RENAME COLUMN "recieverId" TO "receiverId";--> statement-breakpoint
ALTER TABLE "chat-requests" DROP CONSTRAINT "chat-requests_recieverId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chat-requests" ADD CONSTRAINT "chat-requests_receiverId_users_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;