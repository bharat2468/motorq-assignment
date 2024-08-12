import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.midleware.js";
import {
	//createVehicle, updateVehicle, deleteVehicle,
	getVehicle,
} from "../controllers/vehicle.controllers.js";

const router = Router();

// router.route("/vehicles").post(verifyJWT, isAdmin, createVehicle);
// router.route("/vehicles/:vehicleId").patch(verifyJWT, isAdmin, updateVehicle);
// router.route("/vehicles/:vehicleId").delete(verifyJWT, isAdmin, deleteVehicle);
router.route("/get/:vehicleId").get(verifyJWT, getVehicle);

export default router;
