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
        <div className="relative px-4 py-3">
            <Search
                className="
            pointer-events-none
            absolute
            left-7
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-slate-500
        "
            />

            <Input
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                placeholder="Search users or conversations..."
                className="
            h-11
            rounded-full
            border-none
            bg-slate-800
            pl-10
            text-sm
            text-white
            placeholder:text-slate-500
            shadow-inner
            transition-all
            duration-200
            focus:bg-slate-700
            focus:ring-2
            focus:ring-blue-500/30
        "
            />
        </div>
    );
}