import { and, eq, isNull } from "drizzle-orm";

import { db } from "../db";
import { groupCalls } from "../db/schema/groupCalls";

export async function getActiveGroupCall(
    conversationId: string
) {
    return db.query.groupCalls.findFirst({
        where: and(
            eq(
                groupCalls.conversationId,
                conversationId
            ),
            isNull(groupCalls.endedAt)
        ),
    });
}

export async function createGroupCall(
    conversationId: string,
    startedBy: string
) {
    const [groupCall] = await db
        .insert(groupCalls)
        .values({
            conversationId,
            startedBy,
        })
        .returning();

    return groupCall;
}

export async function endGroupCall(
    conversationId: string
) {
    const activeCall = await getActiveGroupCall(
        conversationId
    );

    if (!activeCall) {
        return null;
    }

    const [groupCall] = await db
        .update(groupCalls)
        .set({
            endedAt: new Date(),
        })
        .where(eq(groupCalls.id, activeCall.id))
        .returning();

    return groupCall;
}