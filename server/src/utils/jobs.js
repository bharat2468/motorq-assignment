import { agenda } from './agenda.js';
import { Vehicle }  from '../models/vehicle.models.js';
import { Driver } from '../models/driver.models.js';

agenda.define('reset vehicle and driver', async (job) => {
  const { vehicleId, driverId } = job.attrs.data;

  try {
    console.log('Resetting vehicle and driver:', vehicleId, driverId);
    
    await Vehicle.findByIdAndUpdate(vehicleId, { isAvailable: true });
    await Driver.findByIdAndUpdate(driverId, { assignedVehicleId: null });
  } catch (err) {
    console.error('Error resetting vehicle and driver:', err);
  }
});

export default agenda;
