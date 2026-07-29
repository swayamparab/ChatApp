export interface SearchMessage {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    type: "text" | "image" | "video" | "file" | "voice";
}

export interface SearchMessagesResponse {
    success: boolean;
    messages: SearchMessage[];
}