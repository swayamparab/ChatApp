import { db } from "../../db";
import { deleteMessageInput, GetMessagesInput, SendMessageInput } from "./message.validation";
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

export async function sendMessage(userId: string, data: SendMessageInput) {
    const participant = db.query.conversationParticipants.findFirst({
        where: and(
            eq(conversationParticipants.userId, userId),
            eq(conversationParticipants.conversationId, data.conversationId)
        )
    })

    if (!participant) {
        throw new Error("You are not participant of this conversation");
    }

    const [insertedMessage] = await db.insert(messages)
        .values({
            conversationId: data.conversationId,
            senderId: userId,
            content: data.content
        }).returning();

    const message = await db.query.messages.findFirst({
        where: eq(messages.id, insertedMessage.id),
        with: {
            sender: {
                columns: {
                    id: true,
                    username: true,
                },
            },
        },
    });

    return message;
}

export async function deleteMessage(userId: string, data: deleteMessageInput) {
    const message = await db.query.messages.findFirst({
        where: eq(messages.id, data.messageId)
    })

    if (!message) {
        throw new Error("Message not found")
    }

    if (message.senderId !== userId) {
        throw new Error("Unauthorized")
    }

    await db.delete(messages).where(eq(messages.id, data.messageId));

    return {
        messageId: message.id,
        conversationId: message.conversationId
    }
}