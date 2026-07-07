"use client";

import { useState } from "react";
import { socket } from "@/lib/socket";

export default function Home() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      console.log("Logged in!");

      
      socket.on("connect", () => {
        console.log("Socket Connected!");
        
        socket.emit("ping", (response: { success: boolean; message: string }) => {
          console.log(response);
        });
      });
      socket.connect();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex w-80 flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="rounded bg-black p-2 text-white"
        >
          Login & Connect Socket
        </button>
      </div>
    </main>
  );
}