"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
    value: string;
    onValueChange: (value: string) => void;
};

export default function SearchBar({
    value,
    onValueChange,
}: SearchBarProps) {
    return (
        <div className="relative p-4">
            <Search
                className="
                    pointer-events-none
                    absolute
                    left-7
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-slate-400
                "
            />
            <Input
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder="Search users or conversations...."
                className="pl-10"
            />
        </div>
    );
}