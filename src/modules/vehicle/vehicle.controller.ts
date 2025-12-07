import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

// POST | "/api/v1/vehicles" | Create Vehicle
const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
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

// GET | "/api/v1/vehicles" | Get all vehicles
const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicles();

    res.status(200).json({
      success: true,
      message:
        result.rowCount === 0
          ? "No vehicles found"
          : "Vehicles retrieved successfully",
      data: result.rows,
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

// GET | "/api/v1/vehicles/:vehicleId" | Get vehicle by ID
const getVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicle(
      req.params.vehicleId as string
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
        errors: "Not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
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

// PUT | "/api/v1/vehicles/:vehicleId" | Update vehicle by ID
const updateVehicle = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body, vehicleId: req.params.vehicleId };
    const result = await vehicleService.updateVehicle(payload);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
        errors: "Not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
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

// DELETE | "/api/v1/vehicles/:vehicleId" | Delete vehicle by ID if not active booking exists
const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.deleteVehicle(
      req.params.vehicleId as string
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
        errors: "Not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
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

export const vehicleController = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
