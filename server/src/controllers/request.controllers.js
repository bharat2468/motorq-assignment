// In your controller file
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request } from "../models/request.models.js";
import { Driver } from "../models/driver.models.js";
import { Vehicle } from "../models/vehicle.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { agenda } from "../utils/agenda.js";
import moment from 'moment';


// Create a request
const createRequest = asyncHandler(async (req, res) => {
    const { driverId, licensePlate, startTime, endTime } = req.body;
    console.log(req.body);
    

    const driver = await Driver.findById(driverId);
    if (!driver) {
        throw new ApiError(404, "Driver not found");
    }

    const vehicle = await Vehicle.findOne({ licensePlate });
    if (!vehicle) {
        throw new ApiError(404, "Vehicle not found");
    }

    const request = await Request.create({ driver: driverId, vehicle: vehicle._id, startTime, endTime });

    return res
        .status(201)
        .json(new ApiResponse(201, request, "Request created successfully"));
});

// // Update request status
// const updateRequestStatus = asyncHandler(async (req, res) => {
//     const requestId = req.params.requestId;
//     const { status } = req.body;

//     const request = await Request.findByIdAndUpdate(
//         requestId,
//         { status },
//         { new: true }
//     );

//     if (!request) {
//         throw new ApiError(404, "Request not found");
//     }

//     return res
//         .status(200)
//         .json(new ApiResponse(200, request, "Request status updated successfully"));
// });

// // Delete expired requests
// const deleteExpiredRequests = asyncHandler(async (req, res) => {
//     const now = new Date();

//     await Request.deleteMany({ endTime: { $lt: now } });

//     return res
//         .status(200)
//         .json(new ApiResponse(200, {}, "Expired requests deleted successfully"));
// });

// Get requests for a specific driver
const getRequestsForDriver = asyncHandler(async (req, res) => {
    const driverId = req.params.driverId;
    const currentTime = moment().toDate();

    const validRequests = await Request.find({
        driver: driverId,
        startTime: { $lte: currentTime },
        endTime: { $gte: currentTime },
        status: 'pending'
    });

    if (!validRequests) {
        throw new ApiError(404, "No requests found for this driver");
    }

    return res.status(200).json(new ApiResponse(200, validRequests, "Requests retrieved successfully"));
});


const acceptRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId;
    const currentTime = moment().toDate();

    // Fetch the request
    const request = await Request.findById(requestId);
    if (!request) {
        throw new ApiError(404, "Request not found");
    }

    if (request.status !== 'pending') {
        throw new ApiError(400, "Request is not in a pending state");
    }

    // Validate that the current time is within the request's time window
    if (currentTime < request.startTime || currentTime > request.endTime) {
        throw new ApiError(400, "Request is not within the valid time window");
    }

    // Fetch the vehicle
    const vehicle = await Vehicle.findById(request.vehicle);
    if (!vehicle || !vehicle.isAvailable) {
        throw new ApiError(400, "Vehicle is not available");
    }

    // Fetch the driver
    const driver = await Driver.findById(request.driver);
    if (!driver || driver.vehicle !== undefined) {
        throw new ApiError(400, "Driver is not available");
    }

    // Assign the vehicle to the driver
    driver.assignedVehicleId = request.vehicle;
    await driver.save();

    // Mark the vehicle as unavailable
    vehicle.isAvailable = false;
    await vehicle.save();

    // Update the request status to accepted
    request.status = 'accepted';
    await request.save();

    // Schedule the job to reset vehicle and driver
    console.log('Scheduling job:', {
        vehicleId: request.vehicle,
        driverId: request.driver,
        endTime: moment(request.endTime).toDate()
    });

    agenda.schedule(moment(request.endTime).toDate(), 'reset vehicle and driver', {
        vehicleId: request.vehicle,
        driverId: request.driver
    });

    return res.status(200).json(new ApiResponse(200, request, "Request accepted successfully"));
});

// Reject request
const rejectRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId;

    const request = await Request.findById(requestId);
    if (!request) {
        throw new ApiError(404, "Request not found");
    }


    if (request.status !== 'pending') {
        throw new ApiError(400, "Request is not in a pending state");
    }

    request.status = 'rejected';
    await request.save();

    return res.status(200).json(new ApiResponse(200, request, "Request rejected successfully"));
});

export {
    createRequest,
    // updateRequestStatus,
    // deleteExpiredRequests,
    getRequestsForDriver,
    acceptRequest,
    rejectRequest
};
