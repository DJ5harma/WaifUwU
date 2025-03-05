import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";
import { Request, Response } from "express";

type body = {
	message: string;
};

type result = {
	text: string;
	emotion: typeof emotions;
};

const emotions = ["happy", "angry", "flirty", "sad"];

const schema: Schema = {
	description: "AI-generated text with an associated emotion",
	type: SchemaType.OBJECT,
	properties: {
		text: {
			type: SchemaType.STRING,
			description: "The AI-generated response",
			nullable: false,
		},
		emotion: {
			type: SchemaType.STRING,
			description: "The emotion associated with the response",
			enum: emotions, // Emotion Enum
			nullable: false,
		},
	},
	required: ["text", "emotion"],
};

export const c_ai_send_message = async (req: Request, res: Response) => {
	const GeminiApiKey = process.env.GEMINI_API_KEY!;

	const model = new GoogleGenerativeAI(GeminiApiKey).getGenerativeModel({
		model: "gemini-2.0-flash",
		generationConfig: {
			responseMimeType: "application/json",
			responseSchema: schema,
		},
	});

	if (!GeminiApiKey)
		throw new Error(
			"ChatBot API key is missing from environment: Server's fault"
		);

	const { message } = req.body as body;

	if (message.length < 1) throw new Error("Input text too short");

	const prompt =
		`<Reply as user's AI waifu with an appropriate emotion (without brackets)> ` +
		message;

	const output = (await model.generateContent(prompt)).response;

	res.json(JSON.parse(output.text()) as result);
	return;
};
