import api from "./axiosConfig";

const getVehicle = async (vehicleId) => {
    return await api.get(`/vehicles/get/${vehicleId}`);
};

const getAllVehicles = async () => {
    return await api.get("/vehicles/get-all");
}

export {
    getVehicle,
    getAllVehicles,
};
