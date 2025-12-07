import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// POST | "/api/v1/auth/signup" | User Registration
router.post("/signup", authController.signupUser);
// POST | "/api/v1/auth/signin" | User Login
router.post("/signin", authController.signinUser);

export const authRoute = router;
