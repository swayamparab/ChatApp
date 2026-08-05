import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../useSocket";
import { useEffect } from "react";
import { GetConversationsResponse } from "@/types/conversations";
import { queryKeys } from "@/lib/query-keys";
import { useRouter, useParams } from "next/navigation";

export function useConversationEvents() {
    const { socket } = useSocket();

    const queryClient = useQueryClient();

    const router = useRouter();

    const { conversationId: activeConversationId } = useParams<{ conversationId: string }>();

    useEffect(() => {
        function handleGroupUpdated(data: {
            conversationId: string;
            groupName: string;
            groupAvatar: string | null;
        }) {
            queryClient.setQueryData<GetConversationsResponse>(
                queryKeys.conversations,
                (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        conversations: old.conversations.map((conversation) =>
                            conversation.conversationId === data.conversationId
                                ? {
                                    ...conversation,
                                    group: {
                                        ...conversation.group!,
                                        name: data.groupName,
                                        avatar: data.groupAvatar,
                                    },
                                }
                                : conversation
                        ),
                    };
                }
            );

            queryClient.invalidateQueries({
                queryKey: queryKeys.groupInfo(data.conversationId),
            });
        }

        function handleLeftGroup(data: {
            conversationId: string;
        }) {
            queryClient.setQueryData<GetConversationsResponse>(
                queryKeys.conversations,
                (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        conversations: old.conversations.filter(
                            (conversation) =>
                                conversation.conversationId !== data.conversationId
                        ),
                    };
                }
            );

            queryClient.removeQueries({
                queryKey: queryKeys.messages(data.conversationId),
            });

            queryClient.removeQueries({
                queryKey: queryKeys.groupInfo(data.conversationId),
            });

            if (activeConversationId === data.conversationId) {
                router.replace("/chat");
            }
        }

        function handleMemberAdded(data: {
            conversationId: string;
            memberIds: string[];
        }) {
            queryClient.refetchQueries({
                queryKey: queryKeys.groupInfo(data.conversationId),
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.conversations,
            });
        }

        function handleMemberRemoved(data: {
            conversationId: string;
            memberId: string;
        }) {
            queryClient.refetchQueries({
                queryKey: queryKeys.groupInfo(data.conversationId),
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.conversations,
            });
        }

        function handleGroupAdded(data: { conversationId: string }) {
            queryClient.invalidateQueries({
                queryKey: queryKeys.conversations,
            });
        }

        function handleGroupDeleted(data: {
            conversationId: string;
        }) {
            queryClient.setQueryData<GetConversationsResponse>(
                queryKeys.conversations,
                (old) => {
                    if (!old) return old;

                    return {
                        ...old,
                        conversations: old.conversations.filter(
                            (conversation) =>
                                conversation.conversationId !==
                                data.conversationId
                        ),
                    };
                }
            );

            queryClient.removeQueries({
                queryKey: queryKeys.groupInfo(data.conversationId),
            });

            queryClient.removeQueries({
                queryKey: queryKeys.messages(data.conversationId),
            });

            if (activeConversationId === data.conversationId) {
                router.replace("/chat");
            }
        }

        function handleRemovedFromGroup(data: {
            conversationId: string;
        }) {
            handleLeftGroup(data);

            if (activeConversationId === data.conversationId) {
                router.replace("/chat");
            }
        }

        function handleAdminChanged(data: {
            conversationId: string;
        }) {
            queryClient.refetchQueries({
                queryKey: queryKeys.groupInfo(data.conversationId),
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.conversations,
            });
        }

        socket.on("group_updated", handleGroupUpdated);
        socket.on("left_group", handleLeftGroup);
        socket.on("member_added", handleMemberAdded);
        socket.on("member_removed", handleMemberRemoved);
        socket.on("group_added", handleGroupAdded);
        socket.on("group_deleted", handleGroupDeleted);
        socket.on("removed_from_group", handleRemovedFromGroup);
        socket.on("admin_promoted", handleAdminChanged);
        socket.on("admin_demoted", handleAdminChanged);

        return () => {
            socket.off("group_updated", handleGroupUpdated);
            socket.off("left_group", handleLeftGroup);
            socket.off("member_added", handleMemberAdded);
            socket.off("member_removed", handleMemberRemoved);
            socket.off("group_added", handleGroupAdded);
            socket.off("group_deleted", handleGroupDeleted);
            socket.off("removed_from_group", handleRemovedFromGroup);
            socket.off("admin_promoted", handleAdminChanged);
            socket.off("admin_demoted", handleAdminChanged);
        };
    }, [socket, queryClient, router, activeConversationId]);
}