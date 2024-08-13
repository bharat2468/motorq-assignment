import api from "./axiosConfig";

const createDriver = async (data) => {
    return await api.post("/drivers/create", data);
};

const getDriver = async (driverId) => {
    return await api.get(`/drivers/get/${driverId}`);
};

const getAllDrivers = async () => {
    return await api.get("/drivers/get-all");
};

export {
    createDriver,
    getDriver,
    getAllDrivers
};
