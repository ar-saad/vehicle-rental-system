import pg, { Pool } from "pg";
import config from ".";

// Fix issue with server converting date into ISOString
const DATE_OID = 1082;
pg.types.setTypeParser(DATE_OID, (stringValue) => {
  return stringValue;
});

// Database Connection
export const pool = new Pool({
  connectionString: `${config.connectionStr}`,
});

// Initialize database
const initDB = async () => {
  // Users
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL 
        CONSTRAINT lowercase CHECK (email = LOWER(email)),
      password VARCHAR(100) NOT NULL 
        CONSTRAINT minimum_6_characters CHECK (LENGTH(password) >= 6),
      phone VARCHAR(15) NOT NULL,
      role VARCHAR(20) NOT NULL
        CHECK (role IN ('admin', 'customer'))
    )  
  `);

  // Vehicles
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(200) NOT NULL,
      type VARCHAR(20) NOT NULL 
        CHECK (type IN ('car', 'bike', 'van', 'SUV')),
      registration_number VARCHAR(200) NOT NULL UNIQUE,
      daily_rent_price INT NOT NULL
        CONSTRAINT positive CHECK (daily_rent_price > 0),
      availability_status VARCHAR(20) NOT NULL DEFAULT 'available' 
        CHECK (availability_status IN ('available', 'booked'))
    )
  `);

  // Bookings
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL
        CONSTRAINT must_in_future CHECK (rent_start_date >= CURRENT_DATE),
      rent_end_date DATE NOT NULL
        CONSTRAINT after_start_date CHECK (rent_end_date >= rent_start_date),
      total_price INT NOT NULL
        CONSTRAINT positive  CHECK (total_price > 0),
      status VARCHAR(20) NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'cancelled', 'returned'))
    )
  `);
};

export default initDB;
