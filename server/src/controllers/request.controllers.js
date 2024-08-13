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
        endTime: { $gte: currentTime },
        status: 'pending'
    });

    if (!validRequests) {
        throw new ApiError(404, "No requests found for this driver");
    }

    return res.status(200).json(new ApiResponse(200, validRequests, "Requests retrieved successfully"));
});





// const acceptRequest = asyncHandler(async (req, res) => {
//     const requestId = req.params.requestId;
//     const currentTime = moment().toDate();

//     // Fetch the request
//     const request = await Request.findById(requestId);
//     if (!request) {
//         throw new ApiError(404, "Request not found");
//     }

//     if (request.status !== 'pending') {
//         throw new ApiError(400, "Request is not in a pending state");
//     }

//     // Validate that the current time is within the request's time window
//     if (currentTime < request.startTime || currentTime > request.endTime) {
//         throw new ApiError(400, "Request is not within the valid time window");
//     }

//     // Fetch the vehicle
//     const vehicle = await Vehicle.findById(request.vehicle);
//     if (!vehicle || !vehicle.isAvailable) {
//         throw new ApiError(400, "Vehicle is not available");
//     }

//     // Fetch the driver
//     const driver = await Driver.findById(request.driver);
//     if (!driver || driver.vehicle !== undefined) {
//         throw new ApiError(400, "Driver is not available");
//     }

//     // Assign the vehicle to the driver
//     driver.assignedVehicleId = request.vehicle;
//     await driver.save();

//     // Mark the vehicle as unavailable
//     vehicle.isAvailable = false;
//     await vehicle.save();

//     // Update the request status to accepted
//     request.status = 'accepted';
//     await request.save();

//     // Schedule the job to reset vehicle and driver
//     console.log('Scheduling job:', {
//         vehicleId: request.vehicle,
//         driverId: request.driver,
//         endTime: moment(request.endTime).toDate()
//     });

//     agenda.schedule(moment(request.endTime).toDate(), 'reset vehicle and driver', {
//         vehicleId: request.vehicle,
//         driverId: request.driver
//     });

//     return res.status(200).json(new ApiResponse(200, request, "Request accepted successfully"));
// });



const acceptRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.requestId;
    const currentTime = moment().toDate();

    // Fetch the request
    const request = await Request.findById(requestId);
    if (!request) {
        throw new ApiError(404, "Request not found");
    }

    const isFutureRequest = currentTime < request.startTime;

    if (isFutureRequest) {
        // Future request handling

        // Fetch the vehicle
        const vehicle = await Vehicle.findById(request.vehicle);
        if (!vehicle || !vehicle.isAvailable) {
            throw new ApiError(400, "Vehicle is not available");
        }

        // Fetch the driver
        const driver = await Driver.findById(request.driver);
        if (!driver) {
            throw new ApiError(400, "Driver not found");
        }

        // Check for overlapping accepted requests for the driver
        const driverConflicts = await Request.find({
            driver: driver._id,
            status: 'accepted',
            $or: [
                { startTime: { $lte: request.endTime }, endTime: { $gte: request.startTime } }
            ]
        });

        if (driverConflicts.length > 0) {
            throw new ApiError(400, "Driver has an overlapping accepted request");
        }

        // Check for overlapping accepted requests for the vehicle
        const vehicleConflicts = await Request.find({
            vehicle: vehicle._id,
            status: 'accepted',
            $or: [
                { startTime: { $lte: request.endTime }, endTime: { $gte: request.startTime } }
            ]
        });

        if (vehicleConflicts.length > 0) {
            throw new ApiError(400, "Vehicle has an overlapping accepted request");
        }

        // Update request status to accepted
        request.status = 'accepted';
        await request.save();

        // Schedule jobs to assign vehicle and reset status
        console.log('Scheduling job to assign vehicle:', {
            vehicleId: request.vehicle,
            driverId: request.driver,
            startTime: moment(request.startTime).toDate(),
            endTime: moment(request.endTime).toDate()
        });

        // Schedule job to assign vehicle at start time
        agenda.schedule(moment(request.startTime).toDate(), 'assign vehicle to driver', {
            vehicleId: request.vehicle,
            driverId: request.driver,
            requestId: request._id
        });

        // Schedule job to reset vehicle and driver at end time
        console.log('Scheduling job to reset vehicle and driver:', {
            vehicleId: request.vehicle,
            driverId: request.driver,
            endTime: moment(request.endTime).toDate()
        });

        agenda.schedule(moment(request.endTime).toDate(), 'reset vehicle and driver', {
            vehicleId: request.vehicle,
            driverId: request.driver
        });

        return res.status(200).json(new ApiResponse(200, request, "Request accepted and jobs scheduled successfully"));



    } else {
        // Current request handling

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
        if (!driver || driver.assignedVehicleId !== undefined) {
            throw new ApiError(400, "Driver is not available");
        }

        // Check for overlapping accepted requests for the driver
        const driverConflicts = await Request.find({
            driver: driver._id,
            status: 'accepted',
            $or: [
                { startTime: { $lte: request.endTime }, endTime: { $gte: request.startTime } }
            ]
        });

        if (driverConflicts.length > 0) {
            throw new ApiError(400, "Driver has an overlapping accepted request");
        }

        // Check for overlapping accepted requests for the vehicle
        const vehicleConflicts = await Request.find({
            vehicle: vehicle._id,
            status: 'accepted',
            $or: [
                { startTime: { $lte: request.endTime }, endTime: { $gte: request.startTime } }
            ]
        });

        if (vehicleConflicts.length > 0) {
            throw new ApiError(400, "Vehicle has an overlapping accepted request");
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
        console.log('Scheduling job to reset vehicle and driver:', {
            vehicleId: request.vehicle,
            driverId: request.driver,
            endTime: moment(request.endTime).toDate()
        });

        agenda.schedule(moment(request.endTime).toDate(), 'reset vehicle and driver', {
            vehicleId: request.vehicle,
            driverId: request.driver
        });

        return res.status(200).json(new ApiResponse(200, request, "Request accepted and jobs scheduled successfully"));
    }
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



const dashboard = asyncHandler(async (req, res) => {
    // Count of all drivers
    const driverCount = await Driver.countDocuments();

    // Count of all vehicles
    const vehicleCount = await Vehicle.countDocuments();

    // 3 most recently created drivers
    const recentDrivers = await Driver.find().sort({ createdAt: -1 }).limit(3);

    // 3 most recently created vehicles
    const recentVehicles = await Vehicle.find().sort({ createdAt: -1 }).limit(3);

    // Most recently created requests
    const recentRequests = await Request.find().sort({ createdAt: -1 }).limit(3);

    return res.status(200).json(new ApiResponse(200, {
        driverCount,
        vehicleCount,
        recentDrivers,
        recentVehicles,
        recentRequests
    }, "Dashboard data retrieved successfully"));
});


export {
    createRequest,
    // updateRequestStatus,
    // deleteExpiredRequests,
    getRequestsForDriver,
    acceptRequest,
    rejectRequest,
    dashboard
};
