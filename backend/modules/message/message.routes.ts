import { requireAuth } from "../../middleware/auth";
import { Router } from "express";
import { getMessagesController, sendMessageController } from "./message.controller";

const router = Router();

router.get("/:conversationId/messages", requireAuth, getMessagesController);
router.post("/:conversationId/message", requireAuth, sendMessageController);

export default router;