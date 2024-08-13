import React, { useState } from "react";
import { FaCar, FaRegEye } from "react-icons/fa";
import { getAllDrivers } from "../../api/drivers";
import { useQuery } from "@tanstack/react-query";
import { Loading, Error } from "../index";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Drivers = () => {
	const [successMessage, setSuccessMessage] = useState("");

	const {
		isLoading,
		isError,
		data: response,
		error,
	} = useQuery({
		queryKey: ["all-drivers"],
		queryFn: getAllDrivers,
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

	const drivers = response?.data?.data;

	return (
		<div className="overflow-x-auto">
			{successMessage && (
				<div className="alert alert-success my-5">
					<div>
						<span>{successMessage}</span>
					</div>
				</div>
			)}
			<table className="table rounded-md">
				<thead>
					<tr className="bg-base-200">
						<th>Date Created</th>
						<th>Name</th>
						<th>Phone</th>
						<th>Location</th>
						<th>Vehicle Status</th>
					</tr>
				</thead>
				<tbody>
					{drivers.map((driver) => (
						<tr key={driver._id} className="hover">
							<td>
								{format(new Date(driver.createdAt), "dd-MM-yyyy")}
							</td>
							
							<td>{driver.name}</td>
							<td>{driver.phone}</td>
							<td>{driver.location}</td>
							<td>
								<Link
									to={`/vehicle-status/${driver._id}`}
									className="btn btn-info btn-sm">
									<FaCar className="mr-1" />
									View Status
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Drivers;
