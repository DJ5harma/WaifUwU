import { Request, Response } from "express";
import { Speechify } from "@speechify/api-sdk";

type result = {
	token: string;
	expiry: number;
};

export const c_ai_obtain_tts_token = async (_: Request, res: Response) => {
	const SpeechifyApiKey = process.env.SPEECHIFY_API_KEY!;
	if (!SpeechifyApiKey)
		throw new Error("TTS API key is missing from environment: Server's fault");

	const speechify = new Speechify({ apiKey: SpeechifyApiKey });

	const tokenResponse = await speechify.accessTokenIssue("audio:all");
	// console.log("speechify token expires in: ", tokenResponse.expiresIn); // 3600 s, i.e. 1 hr

	const token = tokenResponse.accessToken;
	const expiry = Date.now() + tokenResponse.expiresIn * 1000;
	res.json({ token, expiry } as result);
};
