const groupCallParticipants = new Map<
    string,
    Set<string>
>();

export function joinGroupCall(
    conversationId: string,
    userId: string
) {
    let participants =
        groupCallParticipants.get(conversationId);

    if (!participants) {
        participants = new Set();

        groupCallParticipants.set(
            conversationId,
            participants
        );
    }

    participants.add(userId);
}

export function leaveGroupCall(
    conversationId: string,
    userId: string
) {
    const participants =
        groupCallParticipants.get(conversationId);

    if (!participants) {
        return;
    }

    participants.delete(userId);

    if (participants.size === 0) {
        groupCallParticipants.delete(
            conversationId
        );
    }
}

export function getGroupCallParticipants(
    conversationId: string
) {
    return Array.from(
        groupCallParticipants.get(conversationId) ?? []
    );
}

export function isGroupCallFull(
    conversationId: string
) {
    return (
        getGroupCallParticipants(conversationId).length >= 5
    );
}

export function getGroupCallsForUser(
    userId: string
) {
    const conversationIds: string[] = [];

    for (const [conversationId, participants] of groupCallParticipants) {
        if (participants.has(userId)) {
            conversationIds.push(conversationId);
        }
    }

    return conversationIds;
}