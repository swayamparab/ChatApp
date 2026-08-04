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

        socket.on("group_updated", handleGroupUpdated);

        return () => {
            socket.off("group_updated", handleGroupUpdated);
        };
    }, [socket, queryClient]);
}