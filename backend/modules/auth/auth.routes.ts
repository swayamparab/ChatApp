import { Router } from "express";
import { getMeController, loginController, logoutController, signupController } from "./auth.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", requireAuth, getMeController);

export default router;