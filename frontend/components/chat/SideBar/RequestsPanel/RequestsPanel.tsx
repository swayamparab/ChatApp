"use client";

import { useChatRequests } from "@/hooks/useChatRequests";
import { ArrowLeft } from "lucide-react";

import IncomingRequestCard from "./IncomingRequestCard";
import OutgoingRequestCard from "./OutgoingRequestCard";

type RequestsPanelProps = {
    onBack: () => void;
};

export default function RequestsPanel({
    onBack,
}: RequestsPanelProps) {

    const {
        data,
        isLoading,
        isError,
    } = useChatRequests();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>Something went wrong.</p>;
    }

    if(!data){
        return null;
    }

    return (
        <div className="flex h-full flex-col">
            <button
                onClick={onBack}
                className="flex items-center gap-2 border-b border-slate-800 px-4 py-4 hover:bg-slate-800"
            >
                <ArrowLeft className="h-5 w-5" />

                <span className="font-medium">
                    Pending Requests
                </span>
            </button>

            <div className="flex-1 overflow-y-auto p-4">
                <h2 className="mb-2 text-sm font-semibold text-slate-400">
                    Incoming
                </h2>

                {data.incoming.length === 0 ? (
                    <p className="mb-6 text-sm text-slate-500">
                        No incoming requests.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {data.incoming.map((request) => (
                            <IncomingRequestCard
                                key={request.id}
                                requestId={request.id}
                                username={request.sender.username}
                                email={request.sender.email}
                            />
                        ))}
                    </div>
                )}

                <h2 className="mb-2 mt-8 text-sm font-semibold text-slate-400">
                    Outgoing
                </h2>

                {data.outgoing.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        No outgoing requests.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {data.outgoing.map((request) => (
                            <OutgoingRequestCard
                                key={request.id}
                                username={request.receiver.username}
                                email={request.receiver.email}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}