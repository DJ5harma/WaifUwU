import { env } from '../config/env.js';
import { geminiService } from './geminiService.js';
import { localAIService } from './localAIService.js';

/**
 * Unified AI Service that switches between providers based on configuration
 */
export class AIService {
	constructor() {
		this.provider = (env.AI_PROVIDER || 'gemini').toLowerCase();
		this.service = this.provider === 'local' || this.provider === 'ollama' 
			? localAIService 
			: geminiService;
	}

	/**
	 * Generate a response using the configured AI provider
	 * @param {Array} conversationHistory - Array of {role, content} messages
	 * @param {string} userMessage - The new user message
	 * @param {string} personality - Personality type
	 * @returns {Promise<{text: string, emotion: string, tokens: number}>}
	 */
	async generateResponse(conversationHistory, userMessage, personality = 'friendly') {
		return await this.service.generateResponse(conversationHistory, userMessage, personality);
	}

	/**
	 * Get the current provider name
	 * @returns {string}
	 */
	getProvider() {
		return this.provider;
	}

	/**
	 * Check if the current provider is available
	 * @returns {Promise<boolean>}
	 */
	async isAvailable() {
		if (this.provider === 'local' || this.provider === 'ollama') {
			return await localAIService.isAvailable();
		}
		// Gemini is always "available" (will fail at API call if not configured)
		return true;
	}
}

export const aiService = new AIService();

