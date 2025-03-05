import { Request, Response } from "express";
import { Speechify } from "@speechify/api-sdk";

type result = {
	tts_tokens: string[];
};

export const c_ai_obtain_tts_tokens = async (_: Request, res: Response) => {
	const SpeechifyApiKey = process.env.SPEECHIFY_API_KEY!;
	if (!SpeechifyApiKey)
		throw new Error("TTS API key is missing from environment: Server's fault");

	const speechify = new Speechify({ apiKey: SpeechifyApiKey });

	const tts_tokens: string[] = [];
	for (let i = 0; i < 4; ++i) {
		const tokenResponse = await speechify.accessTokenIssue("audio:all");

		const token = tokenResponse.accessToken;
		tts_tokens.push(token);
	}

	res.json({ tts_tokens } as result);
};
