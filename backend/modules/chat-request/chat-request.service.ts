import { chatRequests } from "../../db/schema";
import { db } from "../../db";
import { findUserById } from "../users/user.service";
import { SendChatRequestInput } from "./chat-request.validation";
import { and, eq } from "drizzle-orm";

export async function sendChatRequest(senderId: string, data: SendChatRequestInput) {

    if (senderId === data.receiverId) {
        throw new Error("You cannot send a chat request to yourself")
    }

    const receiver = await findUserById(data.receiverId);

    if (!receiver) {
        throw new Error("User not found")
    }

    const pendingRequest = await db.query.chatRequests.findFirst({
        where: and(
            eq(chatRequests.senderId, senderId),
            eq(chatRequests.receiverId, data.receiverId),
            eq(chatRequests.status, "PENDING")
        )
    })

    if(pendingRequest){
        throw new Error("Chat request already sent");
    }

    const [chatRequest] = await db.insert(chatRequests)
        .values({
            senderId,
            receiverId: data.receiverId
        })
        .returning()

    return chatRequest;

}