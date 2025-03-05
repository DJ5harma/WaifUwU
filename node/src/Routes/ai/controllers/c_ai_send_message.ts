import { GoogleGenerativeAI } from "@google/generative-ai";
import {
	CachedContent,
	GoogleAICacheManager,
} from "@google/generative-ai/server";
import { Request, Response } from "express";
import { USER } from "../../../Database/USER";

type body = {
	message: string;
};

type result = {
	text: string;
	emotion: typeof emotions;
};

const emotions = ["happy", "angry", "flirty", "sad"];

export const c_ai_send_message = async (req: Request, res: Response) => {
	const GeminiApiKey = process.env.GEMINI_API_KEY!;
	if (!GeminiApiKey)
		throw new Error(
			"ChatBot API key is missing from environment: Server's fault"
		);

	const { message } = req.body as body;
	if (!message.length) throw new Error("Message text too short");

	const { _id } = req.body;

	const user = await USER.findById(_id).select("username");
	if (!user) throw new Error("Your account was not found in the database!");
	const { username } = user;

	const cache = await getCache(GeminiApiKey, _id, username);

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

	res.json(JSON.parse(aiResponse) as result);
	return;
};

const userid_to_cache_map = new Map<string, CachedContent>();
const getCache = async (
	GeminiApiKey: string,
	user_id: string,
	username: string
) => {
	let cache = userid_to_cache_map.get(user_id);

	if (!cache) {
		const ttlSeconds = 300; // 5 mins window
		const cacheManager = new GoogleAICacheManager(GeminiApiKey);

		cache = await cacheManager.create({
			model: "models/gemini-1.5-flash-001",
			ttlSeconds,
			systemInstruction: `You are the AI waifu of the user named ${username}. 
			You are sometimes flirty, cheerful, sad, or angry. Your job is to have fun with the user. 
			Always return your response as a JSON object matching: 
			{
				"text": "The AI-generated response without brackets",
				"emotion": "One of: flirty, cheerful, sad, angry"
				}`,
			contents: [],
		});

		userid_to_cache_map.set(user_id, cache);
		setTimeout(() => {
			userid_to_cache_map.delete(user_id);
		}, ttlSeconds * 1000);
	}

	return cache;
};
