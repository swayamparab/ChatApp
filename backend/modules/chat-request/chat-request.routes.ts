import { requireAuth } from "../../middleware/auth";
import { Router } from "express";
import { acceptChatRequestController, cancelChatRequestController, getChatRequestsController, rejectChatRequestController, sendChatRequestController } from "./chat-request.controller";

const router = Router();

router.get("/", requireAuth, getChatRequestsController);
router.post("/", requireAuth, sendChatRequestController);
router.patch("/:requestId/accept", requireAuth, acceptChatRequestController);
router.patch("/:requestId/reject",requireAuth,rejectChatRequestController);
router.delete("/:requestId",requireAuth,cancelChatRequestController);

export default router;