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

    if (!data) {
        return null;
    }

    return (
        <div className="flex h-full flex-col">
            <button
                onClick={onBack}
                className="
            flex items-center gap-3
            px-5 py-4
            transition-all duration-200
            hover:bg-slate-800/60
        "
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800">
                    <ArrowLeft className="h-5 w-5 text-slate-300" />
                </div>

                <div className="text-left">
                    <p className="font-semibold tracking-tight text-white">
                        Pending Requests
                    </p>

                    <p className="text-xs text-slate-400">
                        Incoming & outgoing requests
                    </p>
                </div>
            </button>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
                <div className="mb-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Incoming
                        </h2>

                        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                            {data.incoming.length}
                        </span>
                    </div>

                    {data.incoming.length === 0 ? (
                        <div className="rounded-2xl bg-slate-900/60 p-6 text-center">
                            <p className="text-sm text-slate-500">
                                No incoming requests
                            </p>
                        </div>
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
                </div>

                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Outgoing
                        </h2>

                        <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                            {data.outgoing.length}
                        </span>
                    </div>

                    {data.outgoing.length === 0 ? (
                        <div className="rounded-2xl bg-slate-900/60 p-6 text-center">
                            <p className="text-sm text-slate-500">
                                No outgoing requests
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data.outgoing.map((request) => (
                                <OutgoingRequestCard
                                    key={request.id}
                                    username={request.receiver.username}
                                    email={request.receiver.email}
                                    requestId={request.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}