"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    
    const router = useRouter();

    const {
        data,
        isLoading,
        isError,
    } = useCurrentUser();

    useEffect(() => {
        if (!isLoading && isError) {
            router.replace("/login");
        }
    }, [isLoading, isError, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return <>{children}</>;
}