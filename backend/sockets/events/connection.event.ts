import { Socket, Server } from "socket.io";
import { registerConversationEvents } from "./conversation.event";
import { registerMessageEvent } from "./message.event";
import { getOnlineUserIds, onlineUsers } from "../helpers/online-users";

import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export function handleConnection(io: Server, socket: Socket) {
  // console.log(`User ${socket.userId} connected`);

  //online status as user connects
  onlineUsers.set(socket.userId, socket.id);
  io.emit("user_online", {
    userId: socket.userId
  })

  //get online users
  socket.emit("online_users", {
    userIds: getOnlineUserIds()
  })

  //join a conversation
  registerConversationEvents(io, socket);

  //send a message
  registerMessageEvent(io, socket);

  //offline status as user disconnects
  socket.on("disconnect", async () => {

    onlineUsers.delete(socket.userId);

    await db
      .update(users)
      .set({
        lastSeen: new Date(),
      })
      .where(eq(users.id, socket.userId));

    io.emit("user_offline", {
      userId: socket.userId,
    });

    // console.log(`User ${socket.userId} disconnected`);
  });
}