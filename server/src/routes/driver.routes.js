import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
	createDriver,
	// updateDriver,
	// deleteDriver,
	getDriver,
	getAllDrivers,
	searchDrivers
} from "../controllers/driver.controllers.js";

const router = Router();

router.route("/create").post(verifyJWT, createDriver);

// router.route("/drivers/:driverId").patch(verifyJWT, isAdmin, updateDriver);

// router.route("/drivers/:driverId").delete(verifyJWT, isAdmin, deleteDriver);

router.route("/get/:driverId").get(verifyJWT, getDriver);

router.route("/get-all").get(verifyJWT, getAllDrivers);

router.post('/searchDrivers', searchDrivers);
export default router;
