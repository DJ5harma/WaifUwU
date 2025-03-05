import { Request, Response } from "express";
import { s_ai_messaging, Tget_bot_response } from "../services/s_ai_messaging";

type body = {
	message: string;
	username: string;
	cache_id?: string;
};

type result = Tget_bot_response;

export const c_ai_send_message = async (req: Request, res: Response) => {
	const { message, cache_id, username } = req.body as body;
	if (!message.length) throw new Error("Message text too short");

	const ai_response: Tget_bot_response = await s_ai_messaging.get_bot_response(
		message,
		cache_id
	);

	res.json(ai_response as result);

	return;
};
