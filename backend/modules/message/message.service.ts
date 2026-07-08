import { db } from "../../db";
import { GetMessagesInput } from "./message.validation";
import { conversationParticipants, messages } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function getMessages(userId: string, data: GetMessagesInput) {

    const participant = await db.query.conversationParticipants.findFirst({
        where: and(
            eq(conversationParticipants.conversationId, data.conversationId),
            eq(conversationParticipants.userId, userId)
        )
    })

    if (!participant) {
        throw new Error("Unauthorized");
    }

    return db.query.messages.findMany({
        where: eq(messages.conversationId, data.conversationId),
        with: {
            sender: {
                columns: {
                    id: true,
                    username: true
                }
            }
        },

        orderBy: (messages, { asc }) => [
            asc(messages.createdAt)
        ]
    })
}