import { Router } from "express";
import { c_ai_send_message } from "./controllers/c_ai_send_message";
import { asyncHandler } from "../../Middleware/asyncHandler";
import { c_ai_obtain_speech_tokens } from "./controllers/c_ai_obtain_speech_tokens";

export const r_ai = Router();

r_ai.post("/send_message", asyncHandler(c_ai_send_message));
r_ai.post("/obtain_speech_tokens", asyncHandler(c_ai_obtain_speech_tokens));
