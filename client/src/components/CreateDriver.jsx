import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { createDriver } from "../api/drivers.js";
import { Input } from "./index";
import Select from "react-select";
import { statesAndCities } from "./dashboard/StatesAndCities.js"; // Make sure this path is correct

function CreateDriver() {
    const [creationSuccess, setCreationSuccess] = useState(false);
    const [cities, setCities] = useState([]);
    const queryClient = new QueryClient();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm();

    const selectedState = watch("state");

    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: createDriver,
        onSuccess: () => {
            setCreationSuccess(true);
            queryClient.invalidateQueries(["drivers"]);
            setTimeout(() => {
                setCreationSuccess(false)
            }, 2000);
        },
        onError: (error) => {
            console.error("Driver creation failed:", error);
        },
    });

    const onSubmit = async (data) => {
        const driverData = {
            ...data,
            location: {
                state: data.state?.value,
                city: data.city?.value
            }
        };
        mutate(driverData);
    };

    const stateOptions = Object.keys(statesAndCities).map(state => ({
        value: state,
        label: state
    }));

    React.useEffect(() => {
        if (selectedState) {
            const cityOptions = statesAndCities[selectedState.value].map(city => ({
                value: city,
                label: city
            }));
            setCities(cityOptions);
        }
    }, [selectedState]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-100">
            <div className="card w-full max-w-lg bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="text-center text-2xl font-bold">
                        Create New Driver
                    </h2>

                    {creationSuccess && <CreationSuccessful />}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Name:"
                            placeholder="Enter driver's name"
                            {...register("name", {
                                required: "Name is required",
                                minLength: {
                                    value: 3,
                                    message: "Name must be at least 3 characters long",
                                },
                            })}
                        />
                        {errors.name && (
                            <p className="text-error text-sm">{errors.name.message}</p>
                        )}

                        <Input
                            label="Email:"
                            type="email"
                            placeholder="Enter driver's email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Please enter a valid email address",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-error text-sm">{errors.email.message}</p>
                        )}

                        <Input
                            label="Phone:"
                            type="tel"
                            placeholder="Enter driver's phone number"
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Please enter a valid 10-digit phone number",
                                },
                            })}
                        />
                        {errors.phone && (
                            <p className="text-error text-sm">{errors.phone.message}</p>
                        )}

                        <div>
                            <label className="label">
                                <span className="label-text">State:</span>
                            </label>
                            <Controller
                                name="state"
                                control={control}
                                rules={{ required: "State is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={stateOptions}
                                        placeholder="Select State"
                                    />
                                )}
                            />
                            {errors.state && (
                                <p className="text-error text-sm">{errors.state.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">City:</span>
                            </label>
                            <Controller
                                name="city"
                                control={control}
                                rules={{ required: "City is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={cities}
                                        isDisabled={!selectedState}
                                        placeholder="Select City"
                                    />
                                )}
                            />
                            {errors.city && (
                                <p className="text-error text-sm">{errors.city.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isPending || creationSuccess}
                        >
                            {isPending ? "Creating Driver..." : "Create Driver"}
                        </button>
                        {isError && (
                            <p className="text-error text-sm mt-2">
                                Driver creation failed:{" "}
                                {error?.response?.data?.message ||
                                    "Please check the information and try again."}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateDriver;

const CreationSuccessful = () => {
    return (
        <div role="alert" className="alert alert-success">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span>Driver created successfully!</span>
        </div>
    );
};