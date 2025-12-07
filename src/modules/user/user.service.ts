import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

// GET | "/api/v1/users" | Get all users
const getUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);

  result.rows.forEach((item) => delete item.password);

  return result;
};

// PUT | "/api/v1/users/:userId" | Update user by ID
const updateUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role, userId } = payload;

  // Retrieve the current data of the user
  const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId]);
  const currentUser = user.rows[0];

  // Set new values if it was provided otherwise use old values
  const newName = name || currentUser.name;
  const newEmail = email || currentUser.email;
  const newPass = password
    ? await bcrypt.hash(password as string, 10)
    : currentUser.password;
  const newPhone = phone || currentUser.phone;
  const newRole = role || currentUser.role;

  // Make the query
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5 WHERE id=$6 RETURNING *`,
    [newName, newEmail, newPass, newPhone, newRole, userId]
  );

  delete result.rows[0].password;

  return result;
};

// DELETE | "/api/v1/users/:userId" | Delete user by ID if no active booking exists
const deleteUser = async (userId: string) => {
  const bookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 AND status=$2`,
    [userId, "active"]
  );

  // Check if the user have any active booking or not
  if (bookings.rowCount !== 0) {
    throw new Error("The user have active booking. Can not delete.");
  }

  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);

  return result;
};

export const userService = {
  getUsers,
  updateUser,
  deleteUser,
};
