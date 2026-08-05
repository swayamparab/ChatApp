import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../useSocket";
import { useEffect } from "react";
import { GetConversationsResponse } from "@/types/conversations";
import { queryKeys } from "@/lib/query-keys";

export function useConversationEvents() {
    const { socket } = useSocket();

    const queryClient = useQueryClient();

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
        }

        function handleMemberAdded(data: {
            conversationId: string;
            memberIds: string[];
        }) {
            queryClient.invalidateQueries({
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
            queryClient.invalidateQueries({
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

            socket.emit("join_conversation", {
                conversationId: data.conversationId,
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
        }

        socket.on("group_updated", handleGroupUpdated);
        socket.on("left_group", handleLeftGroup);
        socket.on("member_added", handleMemberAdded);
        socket.on("member_removed", handleMemberRemoved);
        socket.on("group_added", handleGroupAdded);
        socket.on("group_deleted", handleGroupDeleted);

        return () => {
            socket.off("group_updated", handleGroupUpdated);
            socket.off("left_group", handleLeftGroup);
            socket.off("member_added", handleMemberAdded);
            socket.off("member_removed", handleMemberRemoved);
            socket.off("group_added", handleGroupAdded);
            socket.off("group_deleted", handleGroupDeleted);
        };
    }, [socket, queryClient]);
}