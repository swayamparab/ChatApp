import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";

export default function ChatShell() {
    return (
        <main className="grid h-[100dvh] lg:grid-cols-[320px_1fr]">
            <Sidebar />
            <ChatPanel />
        </main>
    );
}