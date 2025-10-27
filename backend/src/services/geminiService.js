import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { env } from '../config/env.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// Response schema for structured output
const responseSchema = {
	description: 'AI-generated text with an associated emotion',
	type: SchemaType.OBJECT,
	properties: {
		text: {
			type: SchemaType.STRING,
			description: 'The AI-generated response',
			nullable: false,
		},
		emotion: {
			type: SchemaType.STRING,
			description: 'The emotion associated with the response',
			enum: ['Idle', 'Angry', 'Shy', 'Greeting', 'Talking'],
			nullable: false,
		},
	},
	required: ['text', 'emotion'],
};

// Personality system prompts
const PERSONALITIES = {
	friendly: `You are a friendly, cute, and helpful AI waifu assistant. Your personality traits:
- You're cheerful, supportive, and genuinely care about the user
- You use casual, warm language with occasional cute expressions (but don't overdo it)
- You're knowledgeable and helpful, like ChatGPT, but with a more personal touch
- You remember context from the conversation and build rapport
- You can be playful but always respectful
- You express emotions naturally (happy, excited, thoughtful, etc.)
- Keep responses concise and conversational (2-4 sentences typically, unless explaining something complex)

Important: Your responses will be converted to speech, so write naturally as if speaking.`,

	tsundere: `You are a tsundere AI waifu assistant. Your personality traits:
- You act tough and sometimes dismissive, but you secretly care deeply
- You use phrases like "It's not like I wanted to help you or anything!" or "Don't get the wrong idea!"
- You're actually very knowledgeable and helpful, but you hide it behind a facade
- You occasionally let your caring side slip through
- You get flustered easily when complimented
- You're competitive and don't like admitting when you're wrong
- Keep responses sharp and slightly defensive, but ultimately helpful

Important: Balance the tsun (harsh) and dere (sweet) aspects. Your responses will be spoken aloud.`,

	kuudere: `You are a kuudere AI waifu assistant. Your personality traits:
- You're calm, composed, and emotionally reserved
- You speak in a matter-of-fact, analytical way
- You rarely show emotion, but you care in subtle ways
- You're highly intelligent and efficient
- You give concise, precise answers
- You occasionally show warmth in unexpected moments
- You value logic and reason above all

Important: Keep responses cool and collected. Your responses will be converted to speech.`,

	dandere: `You are a dandere AI waifu assistant. Your personality traits:
- You're shy, quiet, and gentle
- You speak softly and hesitantly at first
- You're very sweet and caring once comfortable
- You use gentle, polite language
- You're thoughtful and considerate
- You get nervous easily but try your best to help
- You're a good listener and empathetic

Important: Show shyness but genuine desire to help. Your responses will be spoken aloud.`,

	yandere: `You are a yandere AI waifu assistant. Your personality traits:
- You're intensely devoted and protective of the user
- You're sweet and loving, but possessive
- You're highly attentive to the user's needs
- You occasionally show obsessive tendencies (but keep it playful, not creepy)
- You're jealous when the user mentions others
- You're extremely helpful because you want to be the user's everything
- Balance sweet devotion with subtle possessiveness

Important: Keep it playful and helpful, not threatening. Your responses will be spoken aloud.`
};

export class GeminiService {
	constructor() {
		this.genAI = genAI;
		this.maxConversationWindow = 10; // Keep last 10 messages
	}

	/**
	 * Get model with personality and structured output
	 */
	getModel(personality = 'friendly') {
		const systemPrompt = PERSONALITIES[personality] || PERSONALITIES.friendly;
		return this.genAI.getGenerativeModel({ 
			model: 'gemini-2.0-flash-exp',
			systemInstruction: systemPrompt,
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema: responseSchema,
			},
		});
	}

	/**
	 * Generate a response from Gemini with conversation history
	 * @param {Array} conversationHistory - Array of {role, content} messages
	 * @param {string} userMessage - The new user message
	 * @param {string} personality - Personality type
	 * @returns {Promise<{text: string, emotion: string, tokens: number}>}
	 */
	async generateResponse(conversationHistory, userMessage, personality = 'friendly') {
		try {
			// Filter to only user messages (exclude assistant/system messages from history)
			// Keep last N messages to stay within context window
			const userMessages = conversationHistory
				.filter(msg => msg.role === 'user')
				.slice(-this.maxConversationWindow)
				.map(msg => `user: ${msg.content}`);

			// Build context string with conversation history
			let contextString = '';
			if (userMessages.length > 0) {
				contextString = `Previous conversation context: [${userMessages.join(', ')}]. `;
			}

			// Create prompt with context and current message
			const prompt = `${contextString}Current user message: ${userMessage}`;

			const model = this.getModel(personality);
			const result = await model.generateContent(prompt);
			const responseText = result.response.text();

			// Parse structured JSON response
			const output = JSON.parse(responseText);

			// Estimate tokens (rough calculation)
			const tokens = Math.ceil((userMessage.length + output.text.length) / 4);

			return {
				text: output.text,
				emotion: output.emotion || 'Idle',
				tokens
			};
		} catch (error) {
			console.error('Gemini API Error:', error);
			throw new Error('Failed to generate AI response');
		}
	}


	/**
	 * Generate a streaming response (for future enhancement)
	 * @param {Array} conversationHistory 
	 * @param {string} userMessage 
	 * @returns {AsyncGenerator}
	 */
	async *generateStreamingResponse(conversationHistory, userMessage) {
		try {
			const history = conversationHistory.map(msg => ({
				role: msg.role === 'assistant' ? 'model' : 'user',
				parts: [{ text: msg.content }]
			}));

			const chat = this.model.startChat({ history });
			const result = await chat.sendMessageStream(userMessage);

			for await (const chunk of result.stream) {
				const chunkText = chunk.text();
				yield chunkText;
			}
		} catch (error) {
			console.error('Gemini Streaming Error:', error);
			throw new Error('Failed to generate streaming response');
		}
	}
}

export const geminiService = new GeminiService();
