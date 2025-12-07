import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

// POST | "/api/v1/auth/signup" | User Registration
const signupUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role ) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role]
  );

  delete result.rows[0].password;

  return result;
};

// POST | "/api/v1/auth/signin" | User Login
const signinUser = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error(
      "User data validation failed. Please check your email, password and try again."
    );
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error(
      "User data validation failed. Please check your email, password and try again."
    );
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role, email: user.email },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  delete user.password;

  return { token, user };
};

export const authService = {
  signupUser,
  signinUser,
};
