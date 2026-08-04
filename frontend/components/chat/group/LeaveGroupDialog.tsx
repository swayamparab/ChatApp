"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { TriangleAlert } from "lucide-react";

import { useLeaveGroup } from "@/hooks/group/useLeaveGroup";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupId: string;
};

export default function LeaveGroupDialog({
    open,
    onOpenChange,
    groupId,
}: Props) {
    const {
        leaveGroup,
        isLeaving,
    } = useLeaveGroup();

    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <AlertDialogContent className="border border-red-900/40 bg-slate-900 text-white shadow-2xl">
                <AlertDialogHeader className="items-center text-center">
                    <div
                        className="
                            mb-3
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500/10
                            ring-1
                            ring-red-500/20
                        "
                    >
                        <TriangleAlert className="h-7 w-7 text-red-400" />
                    </div>

                    <AlertDialogTitle className="text-xl font-semibold">
                        Leave Group?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="max-w-sm text-center leading-6 text-slate-400">
                        You will no longer receive messages from this
                        group. You'll need to be added again by a group
                        member if you wish to rejoin.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4 gap-2 sm:justify-end bg-slate-900">
                    <AlertDialogCancel
                        className="
                            border-slate-700
                            bg-slate-800
                            text-white
                            hover:bg-slate-700
                            hover:text-white
                        "
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={() => leaveGroup(groupId)}
                        disabled={isLeaving}
                        className="
                            bg-red-600
                            text-white
                            transition-all
                            duration-200
                            hover:bg-red-700
                            active:scale-95
                            disabled:opacity-60
                        "
                    >
                        {isLeaving
                            ? "Leaving..."
                            : "Leave Group"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}