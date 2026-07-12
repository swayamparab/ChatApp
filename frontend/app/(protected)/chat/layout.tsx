"use client";

import { usePathname } from "next/navigation";

import Sidebar from "@/components/chat/SideBar/Sidebar";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isConversationPage = pathname !== "/chat";

    return (
        <main className="h-dvh lg:grid lg:grid-cols-[320px_1fr]">
            {/* Sidebar */}
            <aside
                className={`
                    h-full border-r border-slate-800
                    ${isConversationPage ? "hidden lg:block" : "block"}
                `}
            >
                <Sidebar />
            </aside>

            {/* Chat */}
            <section
                className={`
                    h-full min-h-0 flex-col overflow-hidden bg-slate-950
                    ${isConversationPage ? "flex" : "hidden lg:flex"}
                `}
            >
                {children}
            </section>
        </main>
    );
}