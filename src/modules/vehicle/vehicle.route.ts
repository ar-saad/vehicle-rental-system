import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import verifyAuth from "../../middleware/verifyAuth";
import { Roles } from "../auth/auth.constant";

const router = Router();

// POST | "/api/v1/vehicles" | Create Vehicle
router.post("/", verifyAuth(Roles.admin), vehicleController.createVehicle);
// GET | "/api/v1/vehicles" | Get all vehicles
router.get("/", vehicleController.getVehicles);
// GET | "/api/v1/vehicles/:vehicleId" | Get vehicle by ID
router.get("/:vehicleId", vehicleController.getVehicle);
// PUT | "/api/v1/vehicles/:vehicleId" | Update vehicle by ID
router.put(
  "/:vehicleId",
  verifyAuth(Roles.admin),
  vehicleController.updateVehicle
);
// DELETE | "/api/v1/vehicles/:vehicleId" | Delete vehicle by ID if not active booking exists
router.delete(
  "/:vehicleId",
  verifyAuth(Roles.admin),
  vehicleController.deleteVehicle
);

export const vehicleRoute = router;
