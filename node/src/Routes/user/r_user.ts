import { log } from "console";
import { Router } from "express";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { c_user_register } from "./controllers/c_register_user";

export const r_user = Router();

r_user.post("/register", asyncHandler(c_user_register));
