"use client";

import { useState } from "react";

import SearchBar from "./SearchBar";
import SidebarHeader from "./SidebarHeader";
import SearchResults from "./Either/SearchResults";
import ConversationList from "./Either/ConversationList";

export default function Sidebar() {
    const [query, setQuery] = useState("");

    return (
        <aside className="flex h-full flex-col border-r border-slate-800 bg-slate-900">
            <SidebarHeader />

            <SearchBar
                value={query}
                onValueChange={setQuery}
            />

            <div className="flex-1 overflow-y-auto">
                {query.trim() ? (
                    <SearchResults query={query} />
                ) : (
                    <ConversationList />
                )}
            </div>
        </aside>
    );
}