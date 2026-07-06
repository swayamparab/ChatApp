import { Socket } from "socket.io";

export function handleConnection(socket: Socket) {
  console.log(`Client connected: ${socket.id}`);

  socket.on("ping", (callback)=>{
    console.log(`Ping recieved from ${socket.id}`)

    callback({
        success: true,
        message: "Pong!"
    })
  })

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
}