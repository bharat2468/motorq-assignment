// import mongoose from "mongoose";
// import express from "express";
// import { DB_NAME } from "./constants";

// const app = express();

// (async () => {
// 	try {
// 		await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`);
// 		app.on("errror", () => {
// 			console.log(error);
// 			throw error;
// 		});
// 		app.listen(process.env.PORT, () => {
// 			console.log(`App is listening on the port ${process.env.PORT}`);
// 		});
// 	} catch (error) {
// 		console.error("ERROR : ", error);
// 		throw error;
// 	}
// })();
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { connectAgenda } from "./utils/agenda.js"; // Assuming you place the agenda connection in agenda/index.js
import { app } from "./app.js";


dotenv.config({
	path: "./env",
});

connectDB()
	.then(() => connectAgenda()) // Connect Agenda after connecting the database
	.then((agenda) => {
		app.on("error", (error) => {
			console.log(error);
		});
		app.listen(process.env.PORT, () => {
			console.log(`App listening on port ${process.env.PORT}`);
		});
		// agenda
		// 	.now("reset vehicle and driver", {
		// 		vehicleId: "66ba4a9b7408d8c3ef9a68a7",
		// 		driverId: "66ba681dc46de8ffbd7c5fb7",
		// 	})
		// 	.then(() => console.log("Job triggered successfully"))
		// 	.catch((error) => console.error("Failed to trigger job:", error));
	})
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
