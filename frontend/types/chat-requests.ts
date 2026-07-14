export type IncomingRequest = {
    id: string;

    sender: {
        id: string;
        username: string;
        email: string;
    };

    createdAt: string;
};

export type OutgoingRequest = {
    id: string;

    receiver: {
        id: string;
        username: string;
        email: string;
    };

    createdAt: string;
};

export type ChatRequestsResponse = {
    success: boolean;

    incoming: IncomingRequest[];

    outgoing: OutgoingRequest[];

    incomingCount: number;

    outgoingCount: number;
};