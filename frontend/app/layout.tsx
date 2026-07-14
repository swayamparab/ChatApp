import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

import QueryProvider from "@/providers/QueryProvider";
import SocketProvider from "@/providers/SocketProvider";

import { Toaster } from "sonner"

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ChatApp",
    template: "%s | ChatApp",
  },
  description: "Real-time one-to-one chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen`}>
        <QueryProvider>
          <SocketProvider>
            {children}
            <Toaster
            position="top-right"
            richColors
        />
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}