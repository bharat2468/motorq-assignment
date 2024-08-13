import { asyncHandler } from "../utils/asyncHandler.js";
import { Vehicle } from "../models/vehicle.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// const createVehicle = asyncHandler(async (req, res) => {
// 	const { make, model, licensePlate } = req.body;

// 	const existingVehicle = await Vehicle.findOne({ licensePlate });

// 	if (existingVehicle) {
// 		throw new ApiError(400, "Vehicle with this license plate already exists");
// 	}

// 	const vehicle = await Vehicle.create({ make, model, licensePlate });

// 	return res
// 		.status(201)
// 		.json(new ApiResponse(201, vehicle, "Vehicle created successfully"));
// });

// const updateVehicle = asyncHandler(async (req, res) => {
// 	const vehicleId = req.params.vehicleId;
// 	const { make, model, licensePlate } = req.body;

// 	const vehicle = await Vehicle.findByIdAndUpdate(
// 		vehicleId,
// 		{ make, model, licensePlate },
// 		{ new: true }
// 	);

// 	if (!vehicle) {
// 		throw new ApiError(404, "Vehicle not found");
// 	}

// 	return res
// 		.status(200)
// 		.json(new ApiResponse(200, vehicle, "Vehicle updated successfully"));
// });

// const deleteVehicle = asyncHandler(async (req, res) => {
// 	const vehicleId = req.params.vehicleId;
// 	const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId);

// 	if (!deletedVehicle) {
// 		throw new ApiError(404, "Vehicle not found");
// 	}

// 	return res
// 		.status(200)
// 		.json(new ApiResponse(200, deletedVehicle, "Vehicle deleted successfully"));
// });

const getVehicle = asyncHandler(async (req, res) => {
	const vehicleId = req.params.vehicleId;
	const vehicle = await Vehicle.findById(vehicleId);

	if (!vehicle) {
		throw new ApiError(404, "Vehicle not found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, vehicle, "Vehicle retrieved successfully"));
});


// Get all vehicles
const getAllVehicles = asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find();

    if (!vehicles.length) {
        throw new ApiError(404, "No vehicles found");
    }

    return res.status(200).json(new ApiResponse(200, vehicles, "Vehicles retrieved successfully"));
});

export {
	//createVehicle, updateVehicle, deleteVehicle,
	getVehicle,
	getAllVehicles,
};
