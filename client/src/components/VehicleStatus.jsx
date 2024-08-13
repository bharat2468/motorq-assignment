import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getDriver } from "../api/drivers";
import { getVehicle } from "../api/vehicles";
import { createRequest } from "../api/requests";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input, Loading, Error } from "./index"; // Assuming you have an Input component and Loading & Error components
import { useParams } from "react-router-dom";

function VehicleStatusComponent() {
	const { driverId } = useParams();
	console.log(driverId);
	
	const [showGenerateRequest, setShowGenerateRequest] = useState(false);
	const [successMessage, setSuccessMessage] = useState(""); // State for success message

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		setValue,
	} = useForm();

	// Fetch driver data
	let {
		data: driverData,
		isLoading: isDriverLoading,
		isError: isDriverError,
		error: driverError,
	} = useQuery({
		queryFn: () => getDriver(driverId),
		queryKey: ["getDriver", driverId],
		retry: 1,
        refetchOnWindowFocus: false, // Disable automatic refetching on window focus
		refetchOnMount: false,     // Disable automatic refetching on component mount
	});
	driverData = driverData?.data?.data;
	console.log(driverData);

	// Fetch vehicle data if the driver has a vehicleId
	let {
		data: vehicleData,
		isLoading: isVehicleLoading,
		isError: isVehicleError,
		error: vehicleError,
	} = useQuery({
		queryFn: () => getVehicle(driverData?.assignedVehicleId),
		queryKey: ["getVehicle", driverData?.assignedVehicleId],
		enabled: !!driverData?.assignedVehicleId,
	});
	vehicleData = vehicleData?.data?.data;

	console.log(vehicleData);

	// Mutation to create a request
	const {
		mutate: createRequestMutation,
		isPending: isCreatingRequest,
		isError: isCreateRequestError,
		error: createRequestError,
	} = useMutation({
		mutationFn: createRequest,
		onSuccess: (data) => {
			console.log("Request created:", data); // Log the request
			setSuccessMessage("Request created successfully!"); // Show success message
		},
		onError: (error) => {
			console.error("Error creating request:", error);
		},
	});

	// Handle display logic for generating a request
	useEffect(() => {
		if (driverData && !driverData.assignedVehicleId) {
			setShowGenerateRequest(true);
		}
	}, [driverData]);

	// Form submission handler
	const onSubmit = (data) => {
		const { licensePlate, startTime, endTime } = data;
		console.log(data);
		
		createRequestMutation({ driverId, licensePlate, startTime, endTime });
	};

	// Display loading state
	if (isDriverLoading || isVehicleLoading || isCreatingRequest) {
		return (
			<div className="w-full h-[80vh] flex justify-center items-center">
				<Loading className="w-20" />
			</div>
		);
	}

	// Display error state
	if (isDriverError || isVehicleError || isCreateRequestError) {
		console.error(driverError || vehicleError || createRequestError);
		return (
			<div className="w-full h-[80vh] flex justify-center items-center">
				<Error message={driverError?.message || vehicleError?.message || createRequestError?.message} />
			</div>
		);
	}

	return (
		<div className="max-w-lg mx-auto p-4">
			{successMessage && (
				<div className="alert alert-success">
					{successMessage}
				</div>
			)}

			{showGenerateRequest ? (
				<>
					<div className="alert alert-warning">
						No vehicle allotted. Generate a request to allot a vehicle.
					</div>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<Input
							label="Vehicle License Number:"
							placeholder="Enter vehicle license number"
							{...register("licensePlate", {
								required: "Vehicle ID is required",
							})}
						/>
						{errors.licensePlate && <p className="text-error">{errors.licensePlate.message}</p>}

						<div>
							<label className="block">Start Time:</label>
							<DatePicker
								selected={watch("startTime")}
								onChange={(date) => setValue("startTime", date)}
								showTimeSelect
								timeFormat="HH:mm"
								timeIntervals={15}
								dateFormat="MMMM d, yyyy h:mm aa"
								className="input input-bordered w-full"
							/>
						</div>
						<div>
							<label className="block">End Time:</label>
							<DatePicker
								selected={watch("endTime")}
								onChange={(date) => setValue("endTime", date)}
								showTimeSelect
								timeFormat="HH:mm"
								timeIntervals={15}
								dateFormat="MMMM d, yyyy h:mm aa"
								className="input input-bordered w-full"
							/>
						</div>

						<button type="submit" className="btn btn-primary w-full" disabled={isCreatingRequest}>
							{isCreatingRequest ? "Creating Request..." : "Generate Request"}
						</button>
					</form>
				</>
			) : (
				vehicleData && (
					<div className="card bg-base-200 shadow-xl p-4 text-center">
						<h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
						<p><strong>Make:</strong> {vehicleData.make}</p>
						<p><strong>Model:</strong> {vehicleData.model}</p>
						<p><strong>License Plate:</strong> {vehicleData.licensePlate}</p>
					</div>
				)
			)}
		</div>
	);
}

export default VehicleStatusComponent;
