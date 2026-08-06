"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProfile } from "@/services/users";
import { UpdateProfileRequest } from "@/types/users";

import { queryKeys } from "@/lib/query-keys";

export function useProfileActions() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: updateProfile,

        onSuccess: (data) => {
            queryClient.setQueryData(
                queryKeys.currentUser,
                (old: any) => ({
                    ...old,
                    user: data.user,
                })
            );

            toast.success(data.message);
        },

        onError: (error: any) => {
            toast.error(
                error.response?.data?.message ??
                "Failed to update profile."
            );
        },
    });

    return {
        updateProfile: mutation.mutate,
        isUpdatingProfile: mutation.isPending,
    };
}