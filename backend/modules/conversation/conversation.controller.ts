import { Request, Response } from "express";
import { addMembers, createGroup, deleteGroup, demoteAdmin, getConversations, getGroupInfo, leaveGroup, markConversationAsRead, promoteMember, removeMember, searchMessages, updateGroup } from "./conversation.service";
import { ZodError } from "zod";
import { addMembersSchema, createGroupSchema, updateGroupSchema } from "./conversation.validation";
import { emitAdminDemoted, emitAdminPromoted, emitGroupDeleted, emitGroupUpdated, emitMemberAdded, emitMemberRemoved, emitToUser, joinUserToConversation, leaveUserFromConversation } from "../../sockets/helpers/socket";

export async function getConversationsController(req: Request, res: Response) {
    try {

        const conversations = await getConversations(req.userId);

        return res.status(200).json({
            success: true,
            conversations
        })
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

type Params = {
    conversationId: string;
};
export async function markConversationAsReadController(req: Request<Params>, res: Response) {
    try {
        const { conversationId } = req.params;
        const userId = req.userId!;

        await markConversationAsRead(conversationId, userId);

        res.status(200).json({
            success: true,
            message: "Conversation marked as read",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
        });
    }
}

export async function searchMessagesController(req: Request, res: Response) {
    try {
        const userId = req.userId!;
        const conversationId = req.params.conversationId as string;
        const query = String(req.query.q ?? "");

        const messages = await searchMessages(
            conversationId,
            userId,
            query
        );

        res.status(200).json({
            success: true,
            messages,
        });
    } catch (error) {
        console.error("Search messages error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to search messages",
        });
    }
}

export async function createGroupController(req: Request, res: Response) {
    try {
        const data = createGroupSchema.parse(req.body);

        const conversation = await createGroup(
            req.userId,
            data
        );

        return res.status(201).json({
            success: true,
            conversation,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
}

type GroupParams = {
    groupId: string;
};
export async function getGroupInfoController(
    req: Request<GroupParams>,
    res: Response
) {
    try {
        const group = await getGroupInfo(
            req.userId,
            req.params.groupId,
        );

        return res.status(200).json({
            success: true,
            group,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
}

export async function updateGroupController(
    req: Request<GroupParams>,
    res: Response
) {
    try {
        const data = updateGroupSchema.parse(req.body);

        const result = await updateGroup(
            req.params.groupId,
            req.userId,
            data
        );

        emitGroupUpdated(result.conversationId, {
            conversationId: result.conversationId,
            groupName: result.groupName,
            groupAvatar: result.groupAvatar,
        });

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }

        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
}

export async function addMembersController(
    req: Request<GroupParams>,
    res: Response
) {
    try {
        const data = addMembersSchema.parse(req.body);

        const result = await addMembers(
            req.params.groupId,
            req.userId,
            data
        );

        for (const memberId of result.memberIds) {
            joinUserToConversation(
                memberId,
                result.conversationId
            );
        }

        emitMemberAdded(result.conversationId, {
            conversationId: result.conversationId,
            memberIds: result.memberIds,
        });

        for (const memberId of result.memberIds) {
            emitToUser(memberId, "group_added", {
                conversationId: result.conversationId,
            });
        }

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }

        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
}

type MemberParams = {
    groupId: string;
    memberId: string;
};

export async function removeMemberController(
    req: Request<MemberParams>,
    res: Response
) {
    try {
        const result = await removeMember(
            req.params.groupId,
            req.params.memberId,
            req.userId,
        );

        leaveUserFromConversation(
            result.memberId,
            result.conversationId
        );

        emitMemberRemoved(result.conversationId, {
            conversationId: result.conversationId,
            memberId: result.memberId,
        });

        emitToUser(result.memberId, "removed_from_group", {
            conversationId: result.conversationId,
        });

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
}

export async function leaveGroupController(
    req: Request<GroupParams>,
    res: Response
) {
    try {
        const result = await leaveGroup(
            req.params.groupId,
            req.userId
        );

        leaveUserFromConversation(
            result.memberId,
            result.conversationId
        );

        emitMemberRemoved(result.conversationId, {
            conversationId: result.conversationId,
            memberId: result.memberId,
        });

        emitToUser(result.memberId, "left_group", {
            conversationId: result.conversationId,
        });

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
}

export async function promoteMemberController(
    req: Request<MemberParams>,
    res: Response
) {
    try {
        const result = await promoteMember(
            req.userId,
            req.params.groupId,
            req.params.memberId,
        );

        emitAdminPromoted(result.conversationId, {
            conversationId: result.conversationId,
            memberId: result.memberId
        })

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
}

export async function demoteAdminController(
    req: Request<MemberParams>,
    res: Response
) {
    try {
        const result = await demoteAdmin(
            req.params.groupId,
            req.params.memberId,
            req.userId
        );

        emitAdminDemoted(result.conversationId, {
            conversationId: result.conversationId,
            memberId: result.memberId
        })

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
}

export async function deleteGroupController(
    req: Request<GroupParams>,
    res: Response
) {
    try {
        const result = await deleteGroup(
            req.params.groupId,
            req.userId
        );

        for (const memberId of result.memberIds) {
            leaveUserFromConversation(
                memberId,
                result.conversationId
            );
        }

        emitGroupDeleted(result.conversationId, {
            conversationId: result.conversationId,
        });

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Internal Server Error",
        });
    }
}