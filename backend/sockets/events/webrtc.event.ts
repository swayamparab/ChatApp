import { Server, Socket } from "socket.io";

export function registerWebRTCEvents(io: Server, socket: Socket) {
    socket.on("webrtc_offer", ({ conversationId, offer }) => {
        socket.to(conversationId).emit("webrtc_offer", {
            conversationId,
            offer,
        });
    }
    );

    socket.on("webrtc_answer", ({ conversationId, answer }) => {
        socket.to(conversationId).emit("webrtc_answer", {
            conversationId,
            answer,
        });
    }
    );

    socket.on("ice_candidate", ({ conversationId, candidate }) => {
        socket.to(conversationId).emit("ice_candidate", {
            conversationId,
            candidate,
        });
    }
    );

    socket.on("camera_toggle", ({ conversationId, enabled }) => {
        socket.to(conversationId).emit(
            "camera_toggle",
            {
                enabled,
            }
        );
    }
    );
}