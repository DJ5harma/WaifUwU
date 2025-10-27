import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AudioStorageService {
	constructor() {
		// Store audio files in backend/public/audio
		this.audioDir = path.join(__dirname, '../../public/audio');
		this.ensureAudioDirectory();
	}

	/**
	 * Ensure audio directory exists
	 */
	ensureAudioDirectory() {
		if (!fs.existsSync(this.audioDir)) {
			fs.mkdirSync(this.audioDir, { recursive: true });
			console.log('✅ Audio storage directory created:', this.audioDir);
		}
	}

	/**
	 * Generate a unique filename for audio
	 * @param {string} messageId - Message ID
	 * @param {string} voiceId - Voice ID used
	 * @returns {string} Filename
	 */
	generateFilename(messageId, voiceId) {
		const hash = crypto.createHash('md5').update(`${messageId}-${voiceId}`).digest('hex');
		return `${hash}.mp3`;
	}

	/**
	 * Save audio buffer to file
	 * @param {Buffer} audioBuffer - Audio data
	 * @param {string} messageId - Message ID
	 * @param {string} voiceId - Voice ID
	 * @returns {Promise<string>} URL path to audio file
	 */
	async saveAudio(audioBuffer, messageId, voiceId) {
		try {
			const filename = this.generateFilename(messageId, voiceId);
			const filePath = path.join(this.audioDir, filename);

			// Check if file already exists
			if (fs.existsSync(filePath)) {
				console.log('Audio file already exists, reusing:', filename);
				return `/audio/${filename}`;
			}

			// Write audio file
			await fs.promises.writeFile(filePath, audioBuffer);
			console.log('✅ Audio saved:', filename);

			return `/audio/${filename}`;
		} catch (error) {
			console.error('Failed to save audio:', error);
			throw new Error('Audio storage failed');
		}
	}

	/**
	 * Check if audio file exists
	 * @param {string} messageId - Message ID
	 * @param {string} voiceId - Voice ID
	 * @returns {boolean}
	 */
	audioExists(messageId, voiceId) {
		const filename = this.generateFilename(messageId, voiceId);
		const filePath = path.join(this.audioDir, filename);
		return fs.existsSync(filePath);
	}

	/**
	 * Get audio URL if it exists
	 * @param {string} messageId - Message ID
	 * @param {string} voiceId - Voice ID
	 * @returns {string|null}
	 */
	getAudioUrl(messageId, voiceId) {
		if (this.audioExists(messageId, voiceId)) {
			const filename = this.generateFilename(messageId, voiceId);
			return `/audio/${filename}`;
		}
		return null;
	}

	/**
	 * Delete audio file
	 * @param {string} messageId - Message ID
	 * @param {string} voiceId - Voice ID
	 */
	async deleteAudio(messageId, voiceId) {
		try {
			const filename = this.generateFilename(messageId, voiceId);
			const filePath = path.join(this.audioDir, filename);

			if (fs.existsSync(filePath)) {
				await fs.promises.unlink(filePath);
				console.log('🗑️ Audio deleted:', filename);
			}
		} catch (error) {
			console.error('Failed to delete audio:', error);
		}
	}

	/**
	 * Clean up old audio files (older than 30 days)
	 */
	async cleanupOldFiles() {
		try {
			const files = await fs.promises.readdir(this.audioDir);
			const now = Date.now();
			const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

			for (const file of files) {
				const filePath = path.join(this.audioDir, file);
				const stats = await fs.promises.stat(filePath);

				if (now - stats.mtimeMs > maxAge) {
					await fs.promises.unlink(filePath);
					console.log('🗑️ Cleaned up old audio:', file);
				}
			}
		} catch (error) {
			console.error('Cleanup failed:', error);
		}
	}
}

export const audioStorageService = new AudioStorageService();
