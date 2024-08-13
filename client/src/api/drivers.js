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

const searchDrivers = async (searchParams) => {
    const response = await api.post('/drivers/searchDrivers', searchParams);
    return response.data;
};

export {
    createDriver,
    getDriver,
    getAllDrivers,
    searchDrivers,
};
