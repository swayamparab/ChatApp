import { requireAuth } from "@/middleware/auth";
import { Router } from "express";
import { sendChatRequestController } from "./chat-request.controller";

const router = Router();

router.post("/", requireAuth, sendChatRequestController);

export default router;