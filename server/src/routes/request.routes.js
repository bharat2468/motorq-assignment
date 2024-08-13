import { Router } from "express";
import {
	createRequest,
	// updateRequestStatus,
	// deleteExpiredRequests,
	getRequestsForDriver,
	acceptRequest,
	rejectRequest,
} from "../controllers/request.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a new request
router.route("/create").post(verifyJWT, createRequest);

// // Update the status of a request
// router.route("/update-status/:requestId").patch(verifyJWT, updateRequestStatus);

// // Delete expired requests
// router
// 	.route("/delete-expired")
// 	.delete(verifyJWT, isAdmin, deleteExpiredRequests);

// Get all valid requests for a specific driver
router
	.route("/valid-requests/:driverId")
	.get(verifyJWT, getRequestsForDriver);

// Accept a request
router.route("/accept/:requestId").patch(verifyJWT, acceptRequest);

// Reject a request
router.route("/reject/:requestId").patch(verifyJWT, rejectRequest);


export default router;
