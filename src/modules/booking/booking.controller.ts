import { Request, Response } from "express";
import { bookingService } from "./booking.service";

// POST | "/api/v1/bookings" | Create a booking
const bookVehicle = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.bookVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
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

// GET | "/api/v1/bookings" | User: Only get his bookings; Admin: Get all bookings
const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getBookings(req.user);

    if ((result.rowCount as number) > 0) {
      if (req.user?.role === "customer") {
        const data = result.rows.map((item) => ({
          id: item.id,
          vehicle_id: item.vehicle_id,
          rent_start_date: item.rent_start_date,
          rent_end_date: item.rent_end_date,
          total_price: item.total_price,
          status: item.status,
          vehicle: {
            vehicle_name: item.vehicle_name,
            registration_number: item.registration_number,
            type: item.type,
          },
        }));
        res.status(200).json({
          success: true,
          message: "Your bookings retrieved successfully",
          data: data,
        });
      } else {
        const data = result.rows.map((item) => ({
          id: item.id,
          customer_id: item.customer_id,
          vehicle_id: item.vehicle_id,
          rent_start_date: item.rent_start_date,
          rent_end_date: item.rent_end_date,
          total_price: item.total_price,
          status: item.status,
          customer: {
            name: item.name,
            email: item.email,
          },
          vehicle: {
            vehicle_name: item.vehicle_name,
            registration_number: item.registration_number,
            type: item.type,
          },
        }));
        res.status(200).json({
          success: true,
          message: "Bookings retrieved successfully",
          data: data,
        });
      }
    } else {
      return res.status(200).json({
        success: false,
        message: "No bookings found",
        data: [],
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "There is an error",
      errors: error,
    });
  }
};

// PUT | "/api/v1/bookings/:bookingId" | User: Update booking to cancelled; Admin: Update booking to cancelled/returned
const updateBooking = async (req: Request, res: Response) => {
  try {
    // Customer can not return a booking
    if (req.user?.role === "customer" && req.body.status === "returned") {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
        errors: "Unauthorized",
      });
    }

    const result = await bookingService.updateBooking({
      userId: req.user?.id as number,
      role: req.user?.role,
      status: req.body.status,
      bookingId: req.params.bookingId,
    });

    if (req.body.status === "returned") {
      res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: result,
      });
    } else {
      delete result.vehicle;
      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result,
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "There is an error",
      errors: error,
    });
  }
};

export const bookingController = {
  bookVehicle,
  getBookings,
  updateBooking,
};
