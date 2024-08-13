import Agenda from "agenda";
import { DB_NAME } from "../constants.js";

const agenda = new Agenda({
    db: { address: `${process.env.MONGO_DB_URL}/${DB_NAME}?retryWrites=true&w=majority`, collection: "jobs" },
    processEvery: "10 seconds",
});

const connectAgenda = async () => {
    try {
        agenda.on("ready", () => {
            console.log("Agenda started successfully.");
        });

        agenda.on("error", (error) => {
            console.error("Agenda connection error:", error);
        });

        await agenda.start();

        // Import and define jobs after Agenda is started
        import("./jobs.js").then(() => {
            console.log("Jobs loaded successfully.");
        });

        return agenda;
    } catch (error) {
        console.error("Failed to connect Agenda:", error);
        process.exit(1);
    }
};

export { agenda, connectAgenda };
