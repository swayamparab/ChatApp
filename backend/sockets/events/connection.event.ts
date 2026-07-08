import { Socket, Server } from "socket.io";
import { registerConversationEvents } from "./conversation.event";
import { registerMessageEvent } from "./message.event";

export function handleConnection(io: Server, socket: Socket) {
  console.log(`User ${socket.userId} connected`);

  registerConversationEvents(io,socket);
  registerMessageEvent(io, socket);

  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`);
  });
}