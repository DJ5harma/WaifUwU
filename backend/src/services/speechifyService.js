import { Speechify } from '@speechify/api-sdk';
import { env } from '../config/env.js';

export class SpeechifyService {
	constructor() {
		if (!env.SPEECHIFY_API_KEY) {
			throw new Error('SPEECHIFY_API_KEY is missing from environment');
		}
		this.client = new Speechify({
			apiKey: env.SPEECHIFY_API_KEY
		});
	}

	/**
	 * Issue an access token for frontend to use
	 * @param {string} scope - Token scope (e.g., 'audio:all')
	 * @returns {Promise<{accessToken: string, expiresIn: number}>}
	 */
	async issueAccessToken(scope = 'audio:all') {
		try {
			const tokenResponse = await this.client.accessTokenIssue(scope);
			return {
				accessToken: tokenResponse.accessToken,
				expiresIn: tokenResponse.expiresIn // Usually 3600 seconds (1 hour)
			};
		} catch (error) {
			console.error('Speechify token issue error:', error);
			throw new Error('Failed to issue Speechify access token');
		}
	}

	/**
	 * Get available voices
	 * @returns {Promise<Array>}
	 */
	async getVoices() {
		try {
			const voices = await this.client.getVoices();
			return voices;
		} catch (error) {
			console.error('Error fetching voices:', error);
			return [];
		}
	}
}

export const speechifyService = new SpeechifyService();
