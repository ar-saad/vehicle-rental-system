import { pool } from "../../config/db";

// POST | "/api/v1/bookings" | Create a booking
const bookVehicle = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);

  // Check if the vehicle exists and if the vehicle is available or not
  if (vehicle.rowCount === 0) {
    throw new Error("Vehicle not found");
  } else if (vehicle.rows[0].availability_status !== "available") {
    throw new Error("Vehicle not available");
  }

  const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [
    customer_id,
  ]);
  // Check if the user exists
  if (user.rowCount === 0) {
    throw new Error("User not found");
  }

  // Calculate total price
  const start_date = new Date(rent_start_date as Date);
  const end_date = new Date(rent_end_date as Date);

  const ms_per_day = 1000 * 60 * 60 * 24;
  const totalDays =
    Math.round((end_date.getTime() - start_date.getTime()) / ms_per_day) + 1;

  const totalPrice = totalDays * vehicle.rows[0].daily_rent_price;

  if (totalDays <= 0) {
    throw new Error("End date must be after or equal to start date");
  }

  // Save booking data to DB
  const result = await pool.query(
    `
    INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
    `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      totalPrice,
      "active",
    ]
  );

  // Update vehicle booking status
  await pool.query(
    `
      UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *
    `,
    ["booked", vehicle_id]
  );

  return {
    ...result.rows[0],
    vehicle: {
      vehicle_name: vehicle.rows[0].vehicle_name,
      daily_rent_price: vehicle.rows[0].daily_rent_price,
    },
  };
};

// GET | "/api/v1/bookings" | User: Only get his bookings; Admin: Get all bookings
const getBookings = async (user: any) => {
  // If the user is a customer then only send his own bookings
  if (user?.role === "customer") {
    const result = await pool.query(
      `SELECT * FROM bookings JOIN users ON bookings.customer_id=users.id JOIN vehicles ON bookings.vehicle_id=vehicles.id WHERE customer_id=$1`,
      [user?.id]
    );
    return result;
  } else {
    const result = await pool.query(
      `SELECT * FROM bookings JOIN users ON bookings.customer_id=users.id JOIN vehicles ON bookings.vehicle_id=vehicles.id`
    );
    return result;
  }
};

// PUT | "/api/v1/bookings/:bookingId" | User: Update booking to cancelled; Admin: Update booking to cancelled/returned
const updateBooking = async (payload: Record<string, unknown>) => {
  const { userId, role, status, bookingId } = payload;

  const booking = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);

  // Check if booking actually exists
  if (booking.rowCount === 0) {
    throw new Error("Booking not found");
  }

  // Check if the user is trying to cancel another users booking
  if (userId !== booking.rows[0].customer_id && role !== "admin") {
    throw new Error("You do not have permission to perform this action");
  }

  // If the booking is to be cancelled then check if it has already started
  if (
    status === "cancelled" &&
    (new Date().toISOString().split("T")[0] as string) >=
      booking.rows[0].rent_start_date
  ) {
    throw new Error("Can not cancel booking as it has already started");
  }

  const bookingResult = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, bookingId]
  );

  const vehicleResult = await pool.query(
    `UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
    ["available", booking.rows[0].vehicle_id]
  );

  return {
    ...bookingResult.rows[0],
    vehicle: { availability_status: vehicleResult.rows[0].availability_status },
  };
};

const autoReturnVehicles = async () => {
  const today = new Date().toISOString().split("T")[0];

  const bookingsToUpdate = await pool.query(
    `
      SELECT * FROM bookings WHERE status=$1 AND rent_end_date < $2
    `,
    ["active", today]
  );

  if (bookingsToUpdate.rowCount !== 0) {
    for (const booking of bookingsToUpdate.rows) {
      await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2`, [
        "returned",
        booking.id,
      ]);

      await pool.query(
        `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
        ["available", booking.vehicle_id]
      );
    }
  }

  console.log(`${bookingsToUpdate.rowCount} bookings auto-returned`);
};

export const bookingService = {
  bookVehicle,
  getBookings,
  updateBooking,
  autoReturnVehicles,
};
