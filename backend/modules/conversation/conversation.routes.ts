import { requireAuth } from "../../middleware/auth";
import { Router } from "express";
import { getConversationsController } from "./conversation.controller";

const router = Router();

router.get("/", requireAuth, getConversationsController);

export default router;