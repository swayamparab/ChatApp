import { Router } from "express";
import { loginController, logoutController, signupController } from "./auth.controller";
import { authenticate } from "@/middleware/auth";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);

export default router;