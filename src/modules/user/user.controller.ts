import { Request, Response } from "express";
import { userService } from "./user.service";

// GET | "/api/v1/users" | Get all users
const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "There is an error",
      errors: error,
    });
  }
};

// PUT | "/api/v1/users/:userId" | Update user by ID
const updateUser = async (req: Request, res: Response) => {
  try {
    // If the user is a customer, then check if their ID from JWT token matches the ID of the user he is trying to update
    if (
      req.user?.role === "customer" &&
      Number(req.user?.id) !== Number(req.params.userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
        errors: "Unauthorized",
      });
    }
    const payload = { ...req.body, userId: req.params.userId };
    const result = await userService.updateUser(payload);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: "Not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "There is an error",
      errors: error,
    });
  }
};

// DELETE | "/api/v1/users/:userId" | Delete user by ID
const deleteuser = async (req: Request, res: Response) => {
  try {
    const result = await userService.deleteUser(req.params.userId as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errors: "Not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "There is an error",
      errors: error,
    });
  }
};

export const userController = {
  getUsers,
  updateUser,
  deleteuser,
};
