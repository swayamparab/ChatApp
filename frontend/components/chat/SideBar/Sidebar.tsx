"use client";

import { useState } from "react";

import SearchBar from "./SearchBar";
import SidebarHeader from "./SidebarHeader";
import SearchResults from "./Either/SearchResults";
import ConversationList from "./Either/ConversationList";
import RequestsPanel from "./RequestsPanel/RequestsPanel";
import PendingRequestsButton from "./RequestsPanel/PendingRequestsButton";
import { useChatRequests } from "@/hooks/useChatRequests";

export default function Sidebar() {
    const [query, setQuery] = useState("");

    const [showRequests, setShowRequests] = useState(false);

    const { data: requests } = useChatRequests();



    return (
        <aside className="flex h-full flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
            <SidebarHeader />

            {showRequests ? (
                <RequestsPanel
                    onBack={() => setShowRequests(false)}
                />
            ) : (
                <>
                    <PendingRequestsButton
                        count={requests?.incomingCount ?? 0}
                        onClick={() => setShowRequests(true)}
                    />

                    <SearchBar
                        value={query}
                        onValueChange={setQuery}
                    />

                    <div className="flex-1 overflow-y-auto px-1 pb-2">
                        {query.trim() ? (
                            <SearchResults query={query} />
                        ) : (
                            <ConversationList />
                        )}
                    </div>
                </>
            )}
        </aside>
    );
}