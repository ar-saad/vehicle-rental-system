import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const verifyAuth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers.authorization?.split(" ")[1];
      if (!authToken) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to perform this action",
        });
      }

      const decoded = jwt.verify(
        authToken,
        config.jwtSecret as string
      ) as JwtPayload;
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action",
        });
      }

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "There is an error",
        errors: error,
      });
    }
  };
};

export default verifyAuth;
