import { db } from "../../db";
import { deleteMessageInput, EditMessageInput, GetMessagesInput, SendMessageInput } from "./message.validation";
import { conversationParticipants, conversations, messages } from "../../db/schema";
import { and, eq, ne } from "drizzle-orm";

export async function getMessages(
    userId: string,
    data: GetMessagesInput
) {
    const participant =
        await db.query.conversationParticipants.findFirst({
            where: and(
                eq(
                    conversationParticipants.conversationId,
                    data.conversationId
                ),
                eq(
                    conversationParticipants.userId,
                    userId
                )
            )
        });

    if (!participant) {
        throw new Error("Unauthorized");
    }

    const otherParticipant =
        await db.query.conversationParticipants.findFirst({
            where: and(
                eq(
                    conversationParticipants.conversationId,
                    data.conversationId
                ),
                ne(
                    conversationParticipants.userId,
                    userId
                )
            ),
            columns: {
                lastReadAt: true,
            },
        });

    const conversationMessages =
        await db.query.messages.findMany({
            where: eq(
                messages.conversationId,
                data.conversationId
            ),
            with: {
                sender: {
                    columns: {
                        id: true,
                        username: true,
                    },
                },
            },
            orderBy: (messages, { asc }) => [
                asc(messages.createdAt),
            ],
        });

    return {
        messages: conversationMessages,
        lastReadAt: otherParticipant?.lastReadAt ?? null,
    };
}

export async function sendMessage(userId: string, data: SendMessageInput) {
    const participant = await db.query.conversationParticipants.findFirst({
        where: and(
            eq(conversationParticipants.userId, userId),
            eq(conversationParticipants.conversationId, data.conversationId)
        ),
    });

    if (!participant) {
        throw new Error("You are not a participant of this conversation");
    }

    const message = await db.transaction(async (tx) => {
        const [insertedMessage] = await tx
            .insert(messages)
            .values({
                conversationId: data.conversationId,
                senderId: userId,
                content: data.content,
            })
            .returning();

        await tx
            .update(conversations)
            .set({
                updatedAt: new Date(),
            })
            .where(eq(conversations.id, data.conversationId));

        const message = await tx.query.messages.findFirst({
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

        if (!message) {
            throw new Error("Failed to fetch message");
        }

        return message;
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

export async function editMessage(userId: string, data: EditMessageInput) {

    const message = await db.query.messages.findFirst({
        where: eq(messages.id, data.messageId)
    })

    if (!message) {
        throw new Error("Message not found");
    }

    if (message.senderId !== userId) {
        throw new Error("Unauthorized");
    }

    const [updatedMessage] = await db.update(messages).set({
        content: data.content,
        editedAt: new Date()
    })
        .where(eq(messages.id, data.messageId))
        .returning()

    const fullMessage = await db.query.messages.findFirst({
        where: eq(messages.id, updatedMessage.id),
        with: {
            sender: {
                columns: {
                    id: true,
                    username: true
                }
            }
        }
    })

    if (!fullMessage) {
        throw new Error("Failed to fetch updated message");
    }

    return fullMessage;

}