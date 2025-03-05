import express from "express";
import dotenv from "dotenv";
import { log } from "console";
import { r_user } from "./Routes/user/r_user";
import { auth } from "./Middleware/auth";
import { r_ai } from "./Routes/ai/r_ai";
import dbConnect from "./Database/dbConnect";
import { asyncHandler } from "./Middleware/asyncHandler";
import { s_ai_messaging } from "./Routes/ai/services/s_ai_messaging";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

if (!PORT || !MONGO_URI) console.error("environment variables not accessible!");
else {
	app.use(express.json());

	dbConnect(MONGO_URI).then(() => {
		app.listen(PORT, () => {
			log(`Server running at http://localhost:${PORT}`);
		});
	});

	app.use("/user", r_user);

	app.use("/ai", asyncHandler(auth), r_ai);
}

s_ai_messaging.init();
