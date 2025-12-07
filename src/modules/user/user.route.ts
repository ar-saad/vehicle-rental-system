import { Router } from "express";
import verifyAuth from "../../middleware/verifyAuth";
import { Roles } from "../auth/auth.constant";
import { userController } from "./user.controller";

const router = Router();

// GET | "/api/v1/users" | Get all users
router.get("/", verifyAuth(Roles.admin), userController.getUsers);
// PUT | "/api/v1/users/:userId" | Update user by ID
router.put(
  "/:userId",
  verifyAuth(Roles.admin, Roles.customer),
  userController.updateUser
);
// DELETE | "/api/v1/users/:userId" | Delete user by ID
router.delete("/:userId", verifyAuth(Roles.admin), userController.deleteuser);

export const userRoute = router;
