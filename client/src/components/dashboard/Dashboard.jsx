import React, { useEffect, useState } from "react";
import { FaCar, FaUsers, FaFileAlt } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { fetchDashboardStats } from "../../api/requests";
import { useQuery} from "@tanstack/react-query";
import { Loading, Error } from "../index";

function Dashboard() {

    let {
		isLoading,
		isError,
		data: response,
		error,
	} = useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: fetchDashboardStats,
	});
	console.log(response);
	response = response?.data?.data;
	console.log(response);
	

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


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center bg-base-100 shadow-xl p-4 rounded-lg">
                    <FaUsers className="text-3xl mr-4" />
                    <div>
                        <h2 className="text-lg font-bold">Total Drivers</h2>
                        <p className="text-2xl">{response.driverCount}</p>
                    </div>
                </div>
                <div className="flex items-center bg-base-100 shadow-xl p-4 rounded-lg">
                    <FaCar className="text-3xl mr-4" />
                    <div>
                        <h2 className="text-lg font-bold">Total Vehicles</h2>
                        <p className="text-2xl">{response.vehicleCount}</p>
                    </div>
                </div>
            </div>

            {/* Recent Drivers and Vehicles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-base-100 shadow-xl p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2 flex items-center">
                        <FaUsers className="mr-2" /> Recent Drivers
                    </h2>
                    <ul>
                        {response.recentDrivers.map(driver => (
                            <li key={driver._id} className="mb-2">
                                {driver.name} - {driver.email}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-base-100 shadow-xl p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2 flex items-center">
                        <FaCar className="mr-2" /> Recent Vehicles
                    </h2>
                    <ul>
                        {response.recentVehicles.map(vehicle => (
                            <li key={vehicle._id} className="mb-2">
                                {vehicle.model} - {vehicle.make}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-base-100 shadow-xl p-4 rounded-lg mt-8">
                <h2 className="text-xl font-bold mb-2 flex items-center">
                    <MdAccessTime className="mr-2" /> Recent Requests
                </h2>
                <ul>
                    {response.recentRequests.map(request => (
                        <li key={request._id} className="mb-2">
                            Request ID: {request._id} - Status: {request.status}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;
