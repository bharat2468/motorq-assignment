import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema(
	{
		make: {
			type: String,
			required: true,
			trim: true,
		},
		model: {
			type: String,
			required: true,
			trim: true,
		},
		licensePlate: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
        isAvailable: {
			type: Boolean,
			default: true, 
		},
	},
	{
		timestamps: true,
	}
);

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
