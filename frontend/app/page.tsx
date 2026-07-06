"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";

export default function Home() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Socket Test</div>;
}