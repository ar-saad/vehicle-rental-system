import { Request, Response } from "express";
import { authService } from "./auth.service";

// POST | "/api/v1/auth/signup" | User Registration
const signupUser = async (req: Request, res: Response) => {
  try {
    if (req.body.password.length < 6)
      throw new Error("Password must be at least 6 character long");

    const result = await authService.signupUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
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

// POST | "/api/v1/auth/signin" | User Login
const signinUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.signinUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
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

export const authController = {
  signupUser,
  signinUser,
};
