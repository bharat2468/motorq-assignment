import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRequestsForDriver, acceptRequest, rejectRequest } from "../api/requests";
import { Loading, Error } from "./index"; // Assuming you have Loading & Error components
import { FaCheck, FaTimes } from "react-icons/fa";

function DriverRequest() {
    const [driverId, setDriverId] = useState("");
    const [searchTriggered, setSearchTriggered] = useState(false);

    // State variables for success and error messages
    const [acceptSuccess, setAcceptSuccess] = useState(false);
    const [rejectSuccess, setRejectSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        data: response,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["getRequestsForDriver", driverId],
        queryFn: () => getRequestsForDriver(driverId),
        enabled: searchTriggered && !!driverId,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (response && searchTriggered) {
            setSearchTriggered(false);
        }
    }, [response, searchTriggered]);

    const { mutate: acceptMutation, isLoading: isAccepting } = useMutation({
        mutationFn: acceptRequest,
        onSuccess: () => {
            refetch(); // Refetch the requests after accepting
            setAcceptSuccess(true); // Show success message
            setTimeout(() => setAcceptSuccess(false), 1000); // Hide success message after 1 second
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "Accept request failed";
            setErrorMessage(message); // Show error message
            setTimeout(() => setErrorMessage(""), 1000); // Hide error message after 1 second
        },
    });

    const { mutate: rejectMutation, isLoading: isRejecting } = useMutation({
        mutationFn: rejectRequest,
        onSuccess: () => {
            refetch(); // Refetch the requests after rejecting
            setRejectSuccess(true); // Show success message
            setTimeout(() => setRejectSuccess(false), 1000); // Hide success message after 1 second
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "Reject request failed";
            setErrorMessage(message); // Show error message
            setTimeout(() => setErrorMessage(""), 1000); // Hide error message after 1 second
        },
    });

    const handleSearch = () => {
        setSearchTriggered(true);
    };

    if (isLoading) {
        return (
            <div className="w-full h-[80vh] flex justify-center items-center">
                <Loading className="w-20" />
            </div>
        );
    }

    if (isError) {
        console.error(error);
        return (
            <div className="w-full h-[80vh] flex justify-center items-center">
                <Error message={error?.message} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter Driver ID"
                    className="input input-bordered w-full"
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                />
                <button
                    className="btn btn-primary mt-2"
                    onClick={handleSearch}
                    disabled={isLoading}
                >
                    Search
                </button>
            </div>

            {/* Success message for accept */}
            {acceptSuccess && (
                <div className="alert alert-success">
                    Request accepted successfully!
                </div>
            )}

            {/* Success message for reject */}
            {rejectSuccess && (
                <div className="alert alert-success">
                    Request rejected successfully!
                </div>
            )}

            {/* Error message */}
            {errorMessage && (
                <div className="alert alert-error">
                    {errorMessage}
                </div>
            )}

            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Vehicle ID</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {response?.data?.data.map((request) => (
                        <tr key={request._id} className="hover">
                            <td>{request.vehicle}</td>
                            <td>{new Date(request.startTime).toLocaleString()}</td>
                            <td>{new Date(request.endTime).toLocaleString()}</td>
                            <td>{request.status}</td>
                            <td>
                                <button
                                    className="btn btn-success btn-sm mr-2"
                                    onClick={() => acceptMutation(request._id)}
                                    disabled={isAccepting}
                                >
                                    <FaCheck />
                                </button>
                                <button
                                    className="btn btn-error btn-sm"
                                    onClick={() => rejectMutation(request._id)}
                                    disabled={isRejecting}
                                >
                                    <FaTimes />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DriverRequest;
