import { env } from '../config/env.js';
import { validateEmotion, DEFAULT_EMOTION } from '../utils/emotionValidator.js';

// Personality system prompts (shared with Gemini service)
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

// Emotion detection keywords (fallback when JSON parsing fails)
const EMOTION_KEYWORDS = {
	Angry: ['angry', 'mad', 'frustrated', 'annoyed', 'upset', 'irritated'],
	Shy: ['shy', 'bashful', 'embarrassed', 'nervous', 'hesitant', 'timid'],
	Greeting: ['hello', 'hi', 'greeting', 'welcome', 'hey', 'greetings'],
	Talking: ['explaining', 'discussing', 'telling', 'sharing', 'talking'],
	Idle: [] // Default
};

/**
 * Detect emotion from text based on keywords
 * Returns a valid emotion that matches frontend WAIFU_ANIMATION_TYPE
 */
function detectEmotion(text) {
	const lowerText = text.toLowerCase();
	for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
		if (keywords.some(keyword => lowerText.includes(keyword))) {
			return emotion; // Already validated as valid emotion
		}
	}
	return DEFAULT_EMOTION;
}

/**
 * Extract JSON from response (handles cases where LLM adds extra text)
 */
function extractJSON(responseText) {
	try {
		// Try parsing directly first
		return JSON.parse(responseText);
	} catch (e) {
		// Try to extract JSON from markdown code blocks
		const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
		if (jsonMatch) {
			return JSON.parse(jsonMatch[1]);
		}
		
		// Try to find JSON object in the text
		const objectMatch = responseText.match(/\{[\s\S]*\}/);
		if (objectMatch) {
			return JSON.parse(objectMatch[0]);
		}
		
		// If all else fails, return text with detected emotion
		const detectedEmotion = detectEmotion(responseText);
		return {
			text: responseText.trim(),
			emotion: validateEmotion(detectedEmotion)
		};
	}
}

export class LocalAIService {
	constructor() {
		this.ollamaUrl = env.OLLAMA_URL || 'http://localhost:11434';
		this.model = env.OLLAMA_MODEL || 'llama3.2';
		this.maxConversationWindow = 10;
	}

	/**
	 * Generate a response using Ollama
	 * @param {Array} conversationHistory - Array of {role, content} messages
	 * @param {string} userMessage - The new user message
	 * @param {string} personality - Personality type
	 * @returns {Promise<{text: string, emotion: string, tokens: number}>}
	 */
	async generateResponse(conversationHistory, userMessage, personality = 'friendly') {
		try {
			const systemPrompt = PERSONALITIES[personality] || PERSONALITIES.friendly;
			
			// Build conversation context
			const messages = [];
			
			// Add system prompt
			messages.push({
				role: 'system',
				content: `${systemPrompt}\n\nYou must respond in JSON format with this structure: {"text": "your response here", "emotion": "Idle|Angry|Shy|Greeting|Talking"}`
			});

			// Add conversation history (last N messages)
			const recentHistory = conversationHistory.slice(-this.maxConversationWindow);
			for (const msg of recentHistory) {
				messages.push({
					role: msg.role === 'assistant' ? 'assistant' : 'user',
					content: msg.content
				});
			}

			// Add current user message
			messages.push({
				role: 'user',
				content: userMessage
			});

			// Call Ollama API
			const response = await fetch(`${this.ollamaUrl}/api/chat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: this.model,
					messages: messages,
					stream: false,
					options: {
						temperature: 0.7,
						top_p: 0.9,
					}
				})
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
			}

			const data = await response.json();
			const responseText = data.message?.content || '';

			if (!responseText) {
				throw new Error('Empty response from Ollama');
			}

			// Parse JSON response
			const output = extractJSON(responseText);

			// Estimate tokens
			const tokens = Math.ceil((userMessage.length + output.text.length) / 4);

			// Validate emotion to ensure it matches frontend types
			const rawEmotion = output.emotion || detectEmotion(output.text);
			const validatedEmotion = validateEmotion(rawEmotion);

			return {
				text: output.text,
				emotion: validatedEmotion,
				tokens
			};
		} catch (error) {
			console.error('Local AI (Ollama) Error:', error);
			throw new Error(`Failed to generate AI response: ${error.message}`);
		}
	}

	/**
	 * Check if Ollama is available
	 * @returns {Promise<boolean>}
	 */
	async isAvailable() {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 3000);
			
			const response = await fetch(`${this.ollamaUrl}/api/tags`, {
				method: 'GET',
				signal: controller.signal
			});
			
			clearTimeout(timeoutId);
			return response.ok;
		} catch (error) {
			return false;
		}
	}
}

export const localAIService = new LocalAIService();

