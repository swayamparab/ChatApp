import { MessageCircleMore } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div
                className="
                    mb-8
                    flex h-24 w-24 items-center justify-center
                    rounded-3xl
                    bg-gradient-to-br
                    from-blue-500/15
                    to-blue-600/5
                    ring-1
                    ring-blue-500/10
                "
            >
                <MessageCircleMore className="h-11 w-11 text-blue-400" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white">
                Welcome to ChatApp
            </h2>

            <p className="mt-3 max-w-max text-sm leading-6 text-slate-400">
                Select a conversation from the sidebar or send a new chat request
                to start messaging.
            </p>
        </div>
    );
}