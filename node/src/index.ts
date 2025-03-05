import express from "express";
import dotenv from "dotenv";
import { log } from "console";
import { r_user } from "./Routes/user/r_user";
import { auth } from "./Middleware/auth";
import { r_ai } from "./Routes/ai/r_ai";
import dbConnect from "./Database/dbConnect";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI!;

app.use(express.json());

dbConnect(MONGO_URI).then(() => {
	app.listen(PORT, () => {
		log(`Server running at http://localhost:${PORT}`);
	});
});

app.use("/user", r_user);
app.use("/ai", auth, r_ai);
