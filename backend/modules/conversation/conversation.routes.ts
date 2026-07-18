import { requireAuth } from "../../middleware/auth";
import { Router } from "express";
import { getConversationsController, markConversationAsReadController } from "./conversation.controller";

const router = Router();

router.get("/", requireAuth, getConversationsController);
router.patch("/:conversationId/read",requireAuth,markConversationAsReadController);

export default router;