import { Router } from "express";

import { requireAuth } from "../../middleware/auth";
import { searchUsersController } from "./user.controller";

const router = Router();

router.get("/search", requireAuth, searchUsersController);

export default router;