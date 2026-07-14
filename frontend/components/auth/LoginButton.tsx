"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/auth";

export default function LoginButton() {
    const router = useRouter();

    async function handleLogin() {
        try {
            // Checks if HttpOnly cookie is valid
            await getCurrentUser();

            // Already logged in
            router.push("/chat");
        } catch {
            // Not logged in
            router.push("/login");
        }
    }

    return (
        <Button
            size="lg"
            className="bg-blue-600 px-8 hover:bg-blue-700"
            onClick={handleLogin}
        >
            Login
        </Button>
    );
}