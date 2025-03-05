import { GoogleGenerativeAI } from "@google/generative-ai";
import {
	CachedContent,
	GoogleAICacheManager,
} from "@google/generative-ai/server";
import { Request, Response } from "express";
import { randomUUID } from "node:crypto";

type body = {
	message: string;
	username: string;
	cache_id?: string;
};

type result = {
	ai_response: {
		text: string;
		emotion: "flirty" | "cheerful" | "angry" | "sad";
	};
	cache_id: string;
};

const cache_id_to_cache_map = new Map<string, CachedContent>();

export const c_ai_send_message = async (req: Request, res: Response) => {
	const GeminiApiKey = process.env.GEMINI_API_KEY!;
	if (!GeminiApiKey)
		throw new Error(
			"ChatBot API key is missing from environment: Server's fault"
		);

	const { message, cache_id, username } = req.body as body;
	if (!message.length) throw new Error("Message text too short");

	let cache: CachedContent | undefined;

	let resultCacheId: string | undefined = cache_id;

	if (resultCacheId) cache = cache_id_to_cache_map.get(resultCacheId);
	if (!cache) {
		const ttlSeconds = 300; // 5 mins window
		const cacheManager = new GoogleAICacheManager(GeminiApiKey);

		cache = await cacheManager.create({
			model: "models/gemini-1.5-flash-001",
			ttlSeconds,
			systemInstruction: `You are the AI waifu of the user ${username}. 
			You are sometimes flirty, cheerful, sad, or angry. Your job is to have fun with the user. 
			Always return your response as a JSON object matching: 
			{
				"text": "The AI-generated response without brackets",
				"emotion": "One of: flirty, cheerful, sad, angry"
				}`,
			contents: [],
		});

		resultCacheId = randomUUID() as string;
		cache_id_to_cache_map.set(resultCacheId, cache);

		const storeResultCacheId = resultCacheId;
		setTimeout(() => {
			cache_id_to_cache_map.delete(storeResultCacheId);
		}, ttlSeconds * 1000);
	}

	const genAi = new GoogleGenerativeAI(GeminiApiKey);
	const genModel = genAi.getGenerativeModelFromCachedContent(cache);
	const output = await genModel.generateContent({
		contents: [
			{
				role: "user",
				parts: [{ text: message }],
			},
		],
	});
	const aiResponse = JSON.parse(output.response.text());

	res.json({
		ai_response: JSON.parse(aiResponse),
		cache_id: resultCacheId,
	} as result);

	return;
};
