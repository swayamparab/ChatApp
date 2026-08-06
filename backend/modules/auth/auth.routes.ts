import { Router } from "express";
import { getMeController, loginController, logoutController, signupController } from "./auth.controller";
import { requireAuth } from "../../middleware/auth";
import { loginLimiter, signupLimiter } from "../../middleware/rateLimiter";

const router = Router();

router.post("/signup", signupLimiter, signupController);
router.post("/login", loginLimiter, loginController);
router.post("/logout", logoutController);
router.get("/me", requireAuth, getMeController);
// router.get("/debug", requireAuth, debugController);

export default router;