import { Socket } from "socket.io";
import { registerConversationEvents } from "./conversation.event";

export function handleConnection(socket: Socket) {
  console.log(`User ${socket.userId} connected`);

  registerConversationEvents(socket);

  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`);
  });
}