import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
	//createVehicle, updateVehicle, deleteVehicle,
	getVehicle,
	getAllVehicles,
} from "../controllers/vehicle.controllers.js";

const router = Router();

// router.route("/vehicles").post(verifyJWT, isAdmin, createVehicle);
// router.route("/vehicles/:vehicleId").patch(verifyJWT, isAdmin, updateVehicle);
// router.route("/vehicles/:vehicleId").delete(verifyJWT, isAdmin, deleteVehicle);
router.route("/get/:vehicleId").get(verifyJWT, getVehicle);

router.route("/get-all").get(verifyJWT, getAllVehicles);

export default router;
