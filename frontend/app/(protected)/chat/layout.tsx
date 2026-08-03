"use client";

import { useParams } from "next/navigation";

import Sidebar from "@/components/chat/SideBar/Sidebar";
import { useJoinConversations } from "@/hooks/conversation/useJoinConversations";
import { useMessageEvents } from "@/hooks/message/useMessageEvents";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { conversationId } = useParams<{
        conversationId?: string;
    }>();

    const isConversationPage = !!conversationId;

    useJoinConversations();
    useMessageEvents(conversationId);

    return (
        <main className="flex h-[100dvh] flex-col overflow-hidden lg:grid lg:grid-cols-[320px_1fr]">
            <aside
                className={`
                    w-full
                    min-h-0
                    overflow-hidden
                    ${isConversationPage ? "hidden lg:block" : "block"}
                `}
            >
                <Sidebar />
            </aside>

            <section
                className={`
            min-h-0
            overflow-hidden
            bg-slate-950
            ${isConversationPage ? "flex" : "hidden lg:flex"}
            flex-col
        `}
            >
                {children}
            </section>
        </main>
    );
}