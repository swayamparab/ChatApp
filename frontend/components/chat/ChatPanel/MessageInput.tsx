"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";

export default function MessageInput() {
    return (
        <div className="border-t border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Type a message..."
                    className="flex-1"
                />

                <Button size="icon">
                    <SendHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}