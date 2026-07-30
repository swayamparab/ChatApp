import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

import QueryProvider from "@/providers/QueryProvider";
import SocketProvider from "@/providers/SocketProvider";

import { Toaster } from "sonner"
import { CallProvider } from "@/providers/CallProvider";
import { WebRTCProvider } from "@/providers/WebRTCProvider";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PingChat",
    template: "%s | PingChat",
  },
  description: "Real-time one-to-one chat application",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <QueryProvider>
          <SocketProvider>
            <WebRTCProvider>
              <CallProvider>
                {children}
                <Toaster
                  position="top-right"
                  richColors
                />
              </CallProvider>
            </WebRTCProvider>
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}