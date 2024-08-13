import mongoose, { Schema } from "mongoose";

const driverSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		location: {
			state: {
				type: String,
				trim: true,
			},
			city: {
				type: String,
				trim: true,
			},
		},
        assignedVehicleId: {
			type: Schema.Types.ObjectId,
			ref: "Vehicle",
			default: null,  // Vehicle assignment is initially null
		},
	},
	{
		timestamps: true,
	}
);

export const Driver = mongoose.model("Driver", driverSchema);
