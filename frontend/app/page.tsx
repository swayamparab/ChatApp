"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function Home() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected!");

      socket.emit(
        "ping",
        (response: { success: boolean; message: string }) => {
          console.log(response);
        }
      );
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Socket Test</div>;
}