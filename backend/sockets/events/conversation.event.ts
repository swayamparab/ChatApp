import { isParticipant } from "../../modules/conversation/conversation.service";
import { Socket } from "socket.io";

export function registerConversationEvents(socket: Socket) {
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

        callback({
            success: true,
        });
    }
    );
}