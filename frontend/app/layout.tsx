import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider"
import SocketProvider from "@/providers/SocketProvider";

export const metadata: Metadata = {
  title: "ChatApp",
  description: "Real-time one-to-one chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <QueryProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
