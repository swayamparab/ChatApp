import { requireAuth } from "../../middleware/auth";
import { Router } from "express";
import { addMembersController, createGroupController, deleteGroupController, demoteAdminController, getConversationsController, getGroupInfoController, leaveGroupController, markConversationAsReadController, promoteMemberController, removeMemberController, searchMessagesController, updateGroupController } from "./conversation.controller";

const router = Router();

router.get("/", requireAuth, getConversationsController);
router.patch("/:conversationId/read", requireAuth, markConversationAsReadController);
router.get("/:conversationId/search", requireAuth, searchMessagesController);

router.post("/groups", requireAuth, createGroupController);
router.get("/groups/:groupId", requireAuth, getGroupInfoController);
router.patch("/groups/:groupId", requireAuth, updateGroupController);
router.patch("/groups/:groupId/members", requireAuth, addMembersController);
router.delete("/groups/:groupId/members/:memberId", requireAuth, removeMemberController);
router.patch("/groups/:groupId/admins/:memberId", requireAuth, promoteMemberController);
router.patch("/groups/:groupId/admins/:memberId/demote", requireAuth, demoteAdminController);
router.delete("/groups/:groupId/leave", requireAuth, leaveGroupController);
router.delete("/groups/:groupId", requireAuth, deleteGroupController);

export default router;