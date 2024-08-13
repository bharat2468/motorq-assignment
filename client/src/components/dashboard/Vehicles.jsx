import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllVehicles } from "../../api/vehicles";
import { Loading, Error } from "../index";
import { FaCheck, FaTimes } from "react-icons/fa";

const Vehicles = () => {
    const {
        isLoading,
        isError,
        data: response,
        error,
    } = useQuery({
        queryKey: ["all-vehicles"],
        queryFn: getAllVehicles,
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return (
            <div className="w-full h-[80vh] flex justify-center items-center">
                <Loading className="w-20" />
            </div>
        );
    }

    if (isError) {
        console.error(error);
        return <Error />;
    }

    const vehicles = response?.data?.data;

    return (
        <div className="overflow-x-auto">
            <table className="table rounded-md">
                <thead>
                    <tr className="bg-base-200">
                        <th>License Number</th>
                        <th>Model</th>
                        <th>Make</th>
                        <th>Availability</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((vehicle) => (
                        <tr key={vehicle._id} className="hover">
                            <td>{vehicle.licensePlate}</td>
                            <td>{vehicle.model}</td>
                            <td>{vehicle.make}</td>
                            <td>
                                {vehicle.isAvailable ? (
                                    <FaCheck className="text-green-500" />
                                ) : (
                                    <FaTimes className="text-red-500" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Vehicles;
