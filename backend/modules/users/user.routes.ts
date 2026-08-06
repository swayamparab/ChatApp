import { Router } from "express";

import { requireAuth } from "../../middleware/auth";
import { searchUsersController, updateProfileController } from "./user.controller";

const router = Router();

router.patch("/profile", requireAuth, updateProfileController);
router.get("/search", requireAuth, searchUsersController);

export default router;