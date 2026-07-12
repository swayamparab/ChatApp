import { isParticipant } from "../../modules/conversation/conversation.service";
import { Server, Socket } from "socket.io";

export function registerConversationEvents(io: Server, socket: Socket) {
    socket.on("join_conversation", async ({ conversationId }, callback) => {
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

        console.log(
            `User ${socket.userId} joined ${conversationId}`
        );

        callback({
            success: true,
        });
    }
    );
}