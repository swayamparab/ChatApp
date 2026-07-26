import { requireAuth } from "../../middleware/auth";
import { Router } from "express";
import { getMessagesController, uploadImageController } from "./message.controller";
import upload from "../../middleware/upload";

const router = Router();

router.get("/:conversationId/messages", requireAuth, getMessagesController);
router.post("/upload/image",requireAuth,upload.single("image"),uploadImageController);

export default router;