import { MessageCircleMore } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-6 rounded-full bg-slate-900 p-6">
                <MessageCircleMore className="h-12 w-12 text-blue-500" />
            </div>

            <h2 className="text-2xl font-semibold text-white">
                Welcome to ChatApp
            </h2>

            <p className="mt-2 max-w-md text-sm text-slate-400">
                Select a conversation from the sidebar to start chatting.
            </p>
        </div>
    );
}