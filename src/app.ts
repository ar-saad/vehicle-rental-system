import express, { Request, Response } from "express";
import initDB from "./config/db";
import config from "./config";
import logger from "./middleware/logger";
import { authRoute } from "./modules/auth/auth.route";
import { userRoute } from "./modules/user/user.route";
import { vehicleRoute } from "./modules/vehicle/vehicle.route";
import { bookingRoute } from "./modules/booking/booking.route";
import autoReturnVehiclesRunner from "./helpers/autoReturnVehiclesRunner";

const port = config.port;
export const app = express();

// Parser
app.use(express.json());

// Middlewares
app.use(logger);

initDB();

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/vehicles", vehicleRoute);
app.use("/api/v1/bookings", bookingRoute);

// Auto run booking update service
autoReturnVehiclesRunner();

// Not Found Route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
    path: req.path,
  });
});
