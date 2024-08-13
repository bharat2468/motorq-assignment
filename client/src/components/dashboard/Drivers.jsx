import React, { useState, useEffect } from "react";
import { FaCar } from "react-icons/fa";
import { getAllDrivers, searchDrivers } from "../../api/drivers";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loading, Error } from "../index";
import { format, isValid, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import Select from "react-select";
import { statesAndCities } from "./StatesAndCities"; // We'll create this file

// Search component for filtering drivers
const SearchComponent = ({ onSearch }) => {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [selectedState, setSelectedState] = useState(null);
	const [selectedCity, setSelectedCity] = useState(null);
	const [cities, setCities] = useState([]);
	const [searchParams, setSearchParams] = useState({
		name: false,
		phone: false,
		location: false,
	});

	const handleStateChange = (selectedOption) => {
		setSelectedState(selectedOption);
		setCities(
			statesAndCities[selectedOption.value].map((city) => ({
				value: city,
				label: city,
			}))
		);
		setSelectedCity(null);
	};

	const handleSearch = () => {
		onSearch({
			name: searchParams.name ? name : "",
			state:
				searchParams.location && selectedState
					? selectedState.value
					: "",
			city:
				searchParams.location && selectedCity ? selectedCity.value : "",
			phone: searchParams.phone ? phone : "",
		});
	};

    const handleReset = () => {
        setName("");
        setPhone("");
        setSelectedState(null);
        setSelectedCity(null);
        setCities([]);
        setSearchParams({
            name: false,
            phone: false,
            location: false,
        });
        onSearch({}); // This will reset the search to show all drivers
    };

	return (
		<div className="mb-4">
			<div>
				<input
					type="checkbox"
					checked={searchParams.name}
					onChange={(e) =>
						setSearchParams((prev) => ({
							...prev,
							name: e.target.checked,
						}))
					}
				/>{" "}
				Name
				{searchParams.name && (
					<input
						type="text"
						placeholder="Enter Name"
						className="input input-bordered w-full"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				)}
			</div>
			<div>
				<input
					type="checkbox"
					checked={searchParams.phone}
					onChange={(e) =>
						setSearchParams((prev) => ({
							...prev,
							phone: e.target.checked,
						}))
					}
				/>{" "}
				Phone
				{searchParams.phone && (
					<input
						type="text"
						placeholder="Enter Phone"
						className="input input-bordered w-full"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
					/>
				)}
			</div>
			<div>
				<input
					type="checkbox"
					checked={searchParams.location}
					onChange={(e) =>
						setSearchParams((prev) => ({
							...prev,
							location: e.target.checked,
						}))
					}
				/>{" "}
				Location
				{searchParams.location && (
					<>
						<Select
							options={Object.keys(statesAndCities).map(
								(state) => ({ value: state, label: state })
							)}
							onChange={handleStateChange}
							value={selectedState}
							placeholder="Select State"
							className="mt-2"
						/>
						<Select
							options={cities}
							onChange={setSelectedCity}
							value={selectedCity}
							isDisabled={!selectedState}
							placeholder="Select City"
							className="mt-2"
						/>
					</>
				)}
			</div>
			<button className="btn btn-primary mt-4 mx-4" onClick={handleSearch}>
				Search
			</button>
            <button className="btn btn-secondary" onClick={handleReset}>
                    Reset
                </button>
		</div>
	);
};

const Drivers = () => {
	const [filteredDrivers, setFilteredDrivers] = useState([]);
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

	useEffect(() => {
		if (response?.data?.data) {
			setFilteredDrivers(response.data.data);
		}
	}, [response]);

	const searchMutation = useMutation({
		mutationFn: searchDrivers,
		onSuccess: (data) => {
			setFilteredDrivers(data?.data || []);
		},
		onError: (error) => {
			console.error("Search failed:", error);
		},
	});

	const handleSearch = (searchParams) => {
        if (Object.keys(searchParams).length === 0) {
            // If searchParams is empty, reset to show all drivers
            setFilteredDrivers(response?.data?.data || []);
        } else {
            searchMutation.mutate(searchParams);
        }
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
		return <Error />;
	}

	const formatDate = (dateString) => {
		const date = parseISO(dateString);
		return isValid(date) ? format(date, "dd-MM-yyyy") : "Invalid Date";
	};

	return (
		<div className="overflow-x-auto">
			{successMessage && (
				<div className="alert alert-success my-5">
					<div>
						<span>{successMessage}</span>
					</div>
				</div>
			)}
			<SearchComponent onSearch={handleSearch} />
			<table className="table rounded-md">
				<thead>
					<tr className="bg-base-200">
						<th>Date Created</th>
						<th>Name</th>
						<th>Phone</th>
						<th>state</th>
						<th>city</th>
						<th>Vehicle Status</th>
					</tr>
				</thead>
				<tbody>
					{filteredDrivers.map((driver) => (
						<tr key={driver._id} className="hover">
							<td>{formatDate(driver.createdAt)}</td>

							<td>{driver.name}</td>
							<td>{driver.phone}</td>
							<td>{driver?.location?.state}</td>
							<td>{driver?.location?.city}</td>
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
