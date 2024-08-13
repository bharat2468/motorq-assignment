import api from "./axiosConfig";

const createRequest = async (data) => {
    return await api.post("/requests/create", data);
};

const getRequestsForDriver = async (driverId) => {
    return await api.get(`/requests/valid-requests/${driverId}`);
};

const acceptRequest = async (requestId) => {
    return await api.patch(`/requests/accept/${requestId}`);
};

const rejectRequest = async (requestId) => {
    return await api.patch(`/requests/reject/${requestId}`);
};

export {
    createRequest,
    getRequestsForDriver,
    acceptRequest,
    rejectRequest
};
