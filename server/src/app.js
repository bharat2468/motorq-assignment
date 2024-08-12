import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

// CORS config
const corsOptions = {
	origin: process.env.ALLOWED_ORIGINS,
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));

// Cookie parser config to read cookies
app.use(cookieParser());

// Config for data received in the requests
app.use(express.json({ limit: "160kb" }));
app.use(express.urlencoded({ extended: true, limit: "160kb" }));
app.use(express.static("public"));

// Routes import
import userRoutes from "./routes/user.routes.js";
import requestRoutes from "./routes/request.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js"; // Import vehicle routes

// Routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/drivers", driverRoutes);
app.use("/api/v1/vehicles", vehicleRoutes); // Use vehicle routes

// Error middleware
app.use(errorMiddleware);

export { app };
