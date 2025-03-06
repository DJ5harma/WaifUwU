import {
	GenerativeModel,
	GoogleGenerativeAI,
	Schema,
	SchemaType,
} from "@google/generative-ai";
import { Queue } from "../../../Utils/Queue";
import { randomUUID } from "node:crypto";

export type Tget_bot_response = {
	text: string;
	emotion: "flirty" | "cheerful" | "angry" | "sad";
	cache_id: string;
};

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
			enum: ["flirty", "cheerful", "angry", "sad"], // Emotion Enum
			nullable: false,
		},
	},
	required: ["text", "emotion"],
};

const max_conversation_window = 5;
const cache_id_chat_map = new Map<string, Queue>();

export class s_ai_messaging {
	private static model: GenerativeModel;

	static init(GeminiApiKey: string) {
		const genAI = new GoogleGenerativeAI(GeminiApiKey);
		this.model = genAI.getGenerativeModel({
			model: "gemini-2.0-flash",
			generationConfig: {
				responseMimeType: "application/json",
				responseSchema: schema,
			},
		});
	}

	static async get_bot_response(message: string, cache_id: string | undefined) {
		let new_cache_id = cache_id;
		if (!new_cache_id) new_cache_id = randomUUID();

		let cache = cache_id_chat_map.get(new_cache_id);
		if (!cache) {
			cache = new Queue();
			cache_id_chat_map.set(new_cache_id, cache);
		}

		cache.enqueue(`user: ${message}`);
		if (cache.size() >= max_conversation_window) cache.dequeue();

		const prompt =
			`Reply as user's Waifu according to this context with emotion: ` +
			`[${cache.get_all().toString()}]`;

		const res = (await this.model.generateContent(prompt)).response;

		const output = JSON.parse(res.text()) as Tget_bot_response;
		output.cache_id = new_cache_id;

		cache.enqueue(`ai: ${output.text}`);
		if (cache.size() >= max_conversation_window) cache.dequeue();

		// console.log(cache_id_chat_map);

		return output;
	}
}
