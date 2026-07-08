import { requireAuth } from "@/middleware/auth";
import { Router } from "express";
import { getMeController } from "../auth/auth.controller";

const router = Router();

router.get("/:conversationId/messages", requireAuth, getMeController);

export default router;