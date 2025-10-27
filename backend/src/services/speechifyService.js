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

	/**
	 * Generate audio buffer from text
	 * @param {string} text - Text to convert to speech
	 * @param {string} voiceId - Voice ID to use
	 * @returns {Promise<Buffer>} Audio buffer
	 */
	async generateAudioBuffer(text, voiceId = 'kristy') {
		try {
			const audioResponse = await this.client.generateAudioFiles({
				voiceId,
				input: text,
				audioFormat: 'mp3'
			});

			// The SDK returns audio data - convert to buffer
			// Note: Actual implementation depends on Speechify SDK response format
			// This is a placeholder - adjust based on actual SDK response
			if (audioResponse.audioData) {
				return Buffer.from(audioResponse.audioData);
			}
			
			throw new Error('No audio data in response');
		} catch (error) {
			console.error('Audio generation error:', error);
			throw new Error('Failed to generate audio');
		}
	}
}

export const speechifyService = new SpeechifyService();
