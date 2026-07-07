import { Socket } from "socket.io";

export function handleConnection(socket: Socket) {
  console.log(
    `User ${socket.userId} connected with socket ${socket.id}`
  );

  socket.on("ping", (callback) => {
    console.log(`Ping recieved from ${socket.id}`)

    callback({
      success: true,
      message: "Pong!"
    })
  })

  socket.on("disconnect", () => {
    console.log(`User ${socket.userId} disconnected`);
  });
}