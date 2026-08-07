export type GroupCallPayload = {
    conversationId: string;
};

export type GroupCallSignalPayload = {
    conversationId: string;
    targetUserId: string;
};

export type GroupCallOfferPayload =
    GroupCallSignalPayload & {
        offer: RTCSessionDescriptionInit;
    };

export type GroupCallAnswerPayload =
    GroupCallSignalPayload & {
        answer: RTCSessionDescriptionInit;
    };

export type GroupCallIceCandidatePayload =
    GroupCallSignalPayload & {
        candidate: RTCIceCandidateInit;
    };