import { Request, Response } from "express";

type body = {
	text: string;
};

export const c_send_message = async (req: Request, res: Response) => {
	const { text } = req.body as body;

	if (text.length < 1) throw new Error("Input text too short");
};
