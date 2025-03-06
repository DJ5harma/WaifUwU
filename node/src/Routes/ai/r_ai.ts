import { Router } from "express";
import { c_ai_send_message } from "./controllers/c_ai_send_message";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { c_ai_obtain_tts_token } from "./controllers/c_ai_obtain_tts_token";

export const r_ai = Router();

r_ai.post("/send_message", asyncHandler(c_ai_send_message));
r_ai.post("/obtain_tts_tokens", asyncHandler(c_ai_obtain_tts_token));
