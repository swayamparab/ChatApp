"use client";

import { useEffect, useState } from "react";
import { socket } from "../../lib/socket";

export default function ChatPage() {
    const [query, setQuery] = useState("");

    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [conversations, setConversations] = useState<any[]>([]);

    const [selectedConversation, setSelectedConversation] = useState<any>(null);

    const [messages, setMessages] = useState<any[]>([]);

    const [content, setContent] = useState("");

    useEffect(() => {
        loadConversations();
    }, []);

    async function loadConversations() {
        try {
            const res = await fetch(
                "http://localhost:5000/api/conversations",
                {
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            setConversations(data.conversations);
        } catch (err) {
            console.error(err);
        }
    }

    async function loadMessages(conversationId: string) {
        try {
            const res = await fetch(
                `http://localhost:5000/api/conversations/${conversationId}/messages`,
                {
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message);
                return;
            }

            setMessages(data.messages);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Connected", socket.id)
        })

        socket.on("disconnect", () => {
            console.log("Disconnected")
        })

        return () => {
            socket.disconnect();
        }
    }, [])

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "350px 1fr",
                height: "100vh",
            }}
        >
            {/* Left */}

            <div
                style={{
                    borderRight: "1px solid gray",
                    padding: 20,
                }}
            >
                <h2>Search User</h2>

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Username"
                />

                <button>Search</button>

                <hr />

                <h2>Search Results</h2>

                {searchResults.map((user) => (
                    <div key={user.id}>{user.username}</div>
                ))}

                <hr />

                <h2>Conversations</h2>

                {conversations.map((conversation) => (
                    <div
                        key={conversation.conversationId}
                        style={{
                            cursor: "pointer",
                            marginBottom: 10,
                        }}
                    >
                        <div
                            key={conversation.conversationId}
                            onClick={() => {
                                setSelectedConversation(conversation);
                                loadMessages(conversation.conversationId);
                                console.log("Joining room", conversation.conversationId);

                                socket.emit(
                                    "join_conversation",
                                    {
                                        conversationId: conversation.conversationId,
                                    },
                                    (response: { success: boolean; message?: string }) => {
                                        console.log(response);
                                    }
                                );
                            }}
                            style={{
                                cursor: "pointer",
                                padding: 10,
                                border: "1px solid gray",
                                marginBottom: 10,
                            }}
                        >
                            <b>{conversation.otherUser.username}</b>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right */}

            <div
                style={{
                    padding: 20,
                }}
            >
                <h2>
                    {selectedConversation
                        ? selectedConversation.otherUser.username
                        : "Select a Conversation"}
                </h2>

                <div
                    style={{
                        height: "80vh",
                        overflowY: "scroll",
                    }}
                >
                    {messages.map((message) => (
                        <div key={message.id}>
                            <b>{message.sender.username}</b>

                            <p>{message.content}</p>
                        </div>
                    ))}
                </div>

                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Message..."
                />

                <button>Send</button>
            </div>
        </div>
    );
}