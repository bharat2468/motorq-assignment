import mongoose, { Schema } from "mongoose";

const requestSchema = new Schema(
	{
		driver: {
			type: Schema.Types.ObjectId,
			ref: "Driver",
			required: true,
		},
		vehicle: {
			type: Schema.Types.ObjectId,
			ref: "Vehicle",
			required: true,
		},
		startTime: {
			type: Date,
			required: true,
		},
		endTime: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "rejected", "expired"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

export const Request = mongoose.model("Request", requestSchema);
