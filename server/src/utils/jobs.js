import { agenda } from './agenda.js';
import { Vehicle } from '../models/vehicle.models.js';
import { Driver } from '../models/driver.models.js';

// Job to assign vehicle to driver at the scheduled start time
agenda.define('assign vehicle to driver', async (job) => {
    const { vehicleId, driverId } = job.attrs.data;

    try {
        console.log('Assigning vehicle to driver:', vehicleId, driverId);

        // Fetch and update the driver and vehicle
        const driver = await Driver.findById(driverId);
        const vehicle = await Vehicle.findById(vehicleId);

        if (!driver || !vehicle || !vehicle.isAvailable) {
            console.error('Error: Vehicle or Driver not found or Vehicle not available');
            return;
        }

        driver.assignedVehicleId = vehicleId;
        vehicle.isAvailable = false;

        await driver.save();
        await vehicle.save();

        console.log('Vehicle assigned to driver successfully');
    } catch (err) {
        console.error('Error assigning vehicle to driver:', err);
    }
});

// Job to reset vehicle and driver assignment at the scheduled end time
agenda.define('reset vehicle and driver', async (job) => {
    const { vehicleId, driverId } = job.attrs.data;

    try {
        console.log('Resetting vehicle and driver:', vehicleId, driverId);

        // Fetch and update the driver and vehicle
        await Vehicle.findByIdAndUpdate(vehicleId, { isAvailable: true });
        await Driver.findByIdAndUpdate(driverId, { assignedVehicleId: null });

        console.log('Vehicle and driver reset successfully');
    } catch (err) {
        console.error('Error resetting vehicle and driver:', err);
    }
});

export default agenda;
