import { asyncHandler } from "../utils/asyncHandler.js";
import { Driver } from "../models/driver.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createDriver = asyncHandler(async (req, res) => {
	const { name, email, phone, location } = req.body;

	const existingDriver = await Driver.findOne({
        $or: [{ email: email.toLowerCase() }, { phone: phone }]
    });


	if (existingDriver) {
		throw new ApiError(400, "Driver with this email or phone already exists");
	}

	const driver = await Driver.create({
		name,
		email: email.toLowerCase(),
		phone,
		location,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, driver, "Driver created successfully"));
});

// const updateDriver = asyncHandler(async (req, res) => {
// 	const driverId = req.params.driverId;
// 	const { name, email, phone, location, isAvailable } = req.body;

// 	const driver = await Driver.findByIdAndUpdate(
// 		driverId,
// 		{ name, email: email.toLowerCase(), phone, location, isAvailable },
// 		{ new: true }
// 	);

// 	if (!driver) {
// 		throw new ApiError(404, "Driver not found");
// 	}

// 	return res
// 		.status(200)
// 		.json(new ApiResponse(200, driver, "Driver updated successfully"));
// });

// const deleteDriver = asyncHandler(async (req, res) => {
// 	const driverId = req.params.driverId;
// 	const deletedDriver = await Driver.findByIdAndDelete(driverId);

// 	if (!deletedDriver) {
// 		throw new ApiError(404, "Driver not found");
// 	}

// 	return res
// 		.status(200)
// 		.json(
// 			new ApiResponse(200, deletedDriver, "Driver deleted successfully")
// 		);
// });

const getDriver = asyncHandler(async (req, res) => {
	const driverId = req.params.driverId;
	const driver = await Driver.findById(driverId);

	if (!driver) {
		throw new ApiError(404, "Driver not found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, driver, "Driver retrieved successfully"));
}); 



// Get all drivers
const getAllDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.find();

    if (!drivers.length) {
        throw new ApiError(404, "No drivers found");
    }

    return res.status(200).json(new ApiResponse(200, drivers, "Drivers retrieved successfully"));
});

const searchDrivers = asyncHandler(async (req, res) => {
    const { name, state, city, phone } = req.body;

    // Create a match stage for MongoDB aggregation pipeline
    const matchStage = {};

    // Add match conditions based on provided filters
    if (name) {
        matchStage.name = { $regex: new RegExp(name, "i") }; // Case-insensitive match for name
    }

    if (state) {
        matchStage["location.state"] = { $regex: new RegExp(state, "i") }; // Case-insensitive match for state
    }

    if (city) {
        matchStage["location.city"] = { $regex: new RegExp(city, "i") }; // Case-insensitive match for city
    }

    if (phone) {
        matchStage.phone = { $regex: new RegExp(phone, "i") }; // Case-insensitive match for phone
    }
    
    // Build the aggregation pipeline
    const pipeline = [
        { $match: matchStage },
    ];

    try {
        // Execute the aggregation pipeline
        const drivers = await Driver.aggregate(pipeline).exec();

        if (drivers.length === 0) {
            throw new ApiError(404, "No drivers found with the specified filters");
        }

        // Send a successful response
        return res.status(200).json(new ApiResponse(200, drivers, "Drivers retrieved successfully"));
    } catch (error) {
        // Handle any errors that occur during the aggregation
        console.error("Error searching drivers:", error);
        throw new ApiError(500, "Server error while searching for drivers");
    }
});

export {
    createDriver,
    // updateDriver,
    // deleteDriver,
    getDriver,
    getAllDrivers,
    searchDrivers,
};