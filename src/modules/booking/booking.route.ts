import { Router } from "express";
import { bookingController } from "./booking.controller";
import verifyAuth from "../../middleware/verifyAuth";
import { Roles } from "../auth/auth.constant";

const router = Router();

// POST | "/api/v1/bookings" | Create a booking
router.post("/", bookingController.bookVehicle);
// GET | "/api/v1/bookings" | User: Only get his bookings; Admin: Get all bookings
router.get(
  "/",
  verifyAuth(Roles.admin, Roles.customer),
  bookingController.getBookings
);
// PUT | "/api/v1/bookings/:bookingId" | User: Update booking to cancelled; Admin: Update booking to cancelled/returned
router.put(
  "/:bookingId",
  verifyAuth(Roles.admin, Roles.customer),
  bookingController.updateBooking
);

export const bookingRoute = router;
