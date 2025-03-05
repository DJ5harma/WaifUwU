import { Router } from "express";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { c_user_register } from "./controllers/c_register_user";
import { c_user_login } from "./controllers/c_login_user";

export const r_user = Router();

r_user.post("/register", asyncHandler(c_user_register));
r_user.post("/login", asyncHandler(c_user_login));
