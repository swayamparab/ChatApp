import { requireAuth } from "../../middleware/auth";
import { Router } from "express";
import { getConversationsController, markConversationAsReadController, searchMessagesController } from "./conversation.controller";

const router = Router();

router.get("/", requireAuth, getConversationsController);
router.patch("/:conversationId/read", requireAuth, markConversationAsReadController);
router.get("/:conversationId/search", requireAuth, searchMessagesController);

export default router;