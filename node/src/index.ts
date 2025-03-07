import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./Database/dbConnect";
import { log } from "console";
import { r_user } from "./Routes/user/r_user";
import { auth } from "./Middleware/auth";
import { r_ai } from "./Routes/ai/r_ai";
import { asyncHandler } from "./Middleware/asyncHandler";
import { s_ai_messaging } from "./Routes/ai/services/s_ai_messaging";

dotenv.config();

const app = express();
const { PORT, MONGO_URI, GEMINI_API_KEY } = process.env;

if (!PORT || !MONGO_URI || !GEMINI_API_KEY)
	console.error("atleast 1 environment variable is not accessible!");
else {
	app.use(cors());
	app.use(express.json());

	dbConnect(MONGO_URI).then(() => {
		app.listen(PORT, () => {
			log(`Server running at http://localhost:${PORT}`);
		});
	});

	app.get("/test", (_, res) => {
		res.json({ server: "is on", communication: "is working" });
	});

	app.use("/user", r_user);

	app.use("/ai", asyncHandler(auth), r_ai);

	s_ai_messaging.init(GEMINI_API_KEY);
}
