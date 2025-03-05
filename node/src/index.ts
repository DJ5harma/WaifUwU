import express from "express";
import dotenv from "dotenv";
import { log } from "console";
import { r_user } from "./Routes/user/r_user";
import { auth } from "./Middleware/auth";
import { r_ai } from "./Routes/ai/r_ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
	log(`Server running at http://localhost:${PORT}`);
});

app.use("/user", r_user);
app.use("/ai", auth, r_ai);
