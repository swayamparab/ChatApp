import Sidebar from "@/components/chat/SideBar/Sidebar";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="grid h-[100dvh] lg:grid-cols-[320px_1fr]">
            <Sidebar />

            <section className="bg-slate-950">
                {children}
            </section>
        </main>
    );
}