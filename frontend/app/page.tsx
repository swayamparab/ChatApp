import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          ChatApp
        </h1>

        <p className="mt-4 text-lg text-slate-400">
          A modern real-time chat application.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg">
              Login
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
            >
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="mt-16 rounded-xl border border-slate-800 bg-slate-900 p-6 text-left">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Features
          </h2>

          <ul className="space-y-2 text-slate-400">
            <li>• Real-time messaging with Socket.IO</li>
            <li>• Secure JWT authentication using HttpOnly cookies</li>
            <li>• One-to-one conversations</li>
            <li>• Typing indicators</li>
            <li>• Delete messages</li>
            <li>• PostgreSQL + Drizzle ORM</li>
            <li>• Responsive interface</li>
          </ul>
        </div>

        <footer className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          <p>Built with Next.js, Express, PostgreSQL, Drizzle ORM & Socket.IO.</p>

          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-slate-400">
              Created by <span className="font-medium text-white">Swayam Parab</span>
            </p>

            <a
              href="https://github.com/swayamparab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 transition-colors hover:text-blue-300"
            >
              GitHub Repository →
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}