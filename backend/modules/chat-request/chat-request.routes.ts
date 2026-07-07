import { requireAuth } from "@/middleware/auth";
import { Router } from "express";
import { acceptChatRequestController, sendChatRequestController } from "./chat-request.controller";

const router = Router();

router.post("/", requireAuth, sendChatRequestController);
router.patch("/:requestId/accept", requireAuth, acceptChatRequestController)

export default router;