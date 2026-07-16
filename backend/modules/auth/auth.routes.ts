import { Router } from "express";
import { debugController, getMeController, loginController, logoutController, signupController } from "./auth.controller";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", requireAuth, getMeController);
router.get("/debug", requireAuth, debugController);

export default router;