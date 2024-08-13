import api from "./axiosConfig";

const getVehicle = async (vehicleId) => {
    return await api.get(`/vehicles/get/${vehicleId}`);
};

export {
    getVehicle
};
