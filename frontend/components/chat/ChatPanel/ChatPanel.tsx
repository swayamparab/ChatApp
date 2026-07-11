import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

export default function ChatPanel() {
    return (
        <div className="flex h-full flex-col">
            <ChatHeader />

            <MessageList />

            <MessageInput />
        </div>
    );
}