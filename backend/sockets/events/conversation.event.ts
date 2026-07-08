import { isParticipant } from "../../modules/conversation/conversation.service";
import { Socket } from "socket.io";

export function registerConversationEvents(socket: Socket) {
    socket.on("join_conversation", async ({ conversationId }, callback) => {
        console.log("JOIN EVENT RECEIVED", conversationId);
        const allowed = await isParticipant(
            socket.userId,
            conversationId
        );

        if (!allowed) {
            return callback({
                success: false,
                message: "Unauthorized",
            });
        }

        socket.join(conversationId);

        console.log(`Joined room ${conversationId}`);

        callback({
            success: true,
        });
    }
    );
}