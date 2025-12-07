import { pool } from "../../config/db";

// POST | "/api/v1/vehicles" | Create Vehicle
const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
      INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

// GET | "/api/v1/vehicles" | Get all vehicles
const getVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

// GET | "/api/v1/vehicles/:vehicleId" | Get vehicle by ID
const getVehicle = async (vehicleId: string) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);

  return result;
};

// PUT | "/api/v1/vehicles/:vehicleId" | Update vehicle by ID
const updateVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
    vehicleId,
  } = payload;

  // Retrieve the current data of the vehicle
  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);
  const currentVehicle = vehicle.rows[0];

  // Set new values if it was provided otherwise use old values
  const new_vehicle_name = vehicle_name || currentVehicle.vehicle_name;
  const new_type = type || currentVehicle.type;
  const new_registration_number =
    registration_number || currentVehicle.registration_number;
  const new_daily_rent_price =
    daily_rent_price || currentVehicle.daily_rent_price;
  const new_availability_status =
    availability_status || currentVehicle.availability_status;

  // Make the query
  const result = await pool.query(
    `
      UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *
    `,
    [
      new_vehicle_name,
      new_type,
      new_registration_number,
      new_daily_rent_price,
      new_availability_status,
      vehicleId,
    ]
  );

  return result;
};

// DELETE | "/api/v1/vehicles/:vehicleId" | Delete vehicle by ID if no active booking exists
const deleteVehicle = async (vehicleId: string) => {
  const bookings = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1 AND status=$2`,
    [vehicleId, "active"]
  );

  // Check if the vehicle have any active booking or not
  if (bookings.rowCount !== 0) {
    throw new Error("The vehicle have active booking. Can not delete.");
  }

  const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [
    vehicleId,
  ]);

  return result;
};

export const vehicleService = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
