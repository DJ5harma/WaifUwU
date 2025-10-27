import { Speechify } from '@speechify/api-sdk';
import { chatAPI } from './api';
import { toast } from 'react-toastify';

interface TTSToken {
	token: string;
	expiry: number;
}

export class SpeechifyService {
	private static speechify = new Speechify({});
	private static ttsToken: TTSToken = {
		token: '',
		expiry: -1,
	};

	/**
	 * Initialize the service and load cached token
	 */
	static init() {
		const storedToken = localStorage.getItem('tts_token');
		if (storedToken) {
			this.ttsToken = JSON.parse(storedToken);
			if (this.ttsToken.expiry < Date.now()) {
				this.ensureToken();
			}
		} else {
			this.ensureToken();
		}
	}

	/**
	 * Ensure we have a valid token
	 */
	private static async ensureToken() {
		if (this.ttsToken.expiry < Date.now()) {
			await this.fetchToken();
		}
	}

	/**
	 * Fetch a new token from backend
	 */
	private static async fetchToken() {
		try {
			const tokenData = await chatAPI.getTTSToken();
			this.ttsToken = tokenData;
			localStorage.setItem('tts_token', JSON.stringify(tokenData));
		} catch (error) {
			console.error('Failed to fetch TTS token:', error);
			throw error;
		}
	}

	/**
	 * Generate audio from text
	 * @param text - Text to convert to speech
	 * @param voiceId - Voice ID to use (default: 'kristy')
	 * @returns HTMLAudioElement ready to play
	 */
	static async generateAudio(text: string, voiceId: string = 'kristy'): Promise<HTMLAudioElement> {
		await this.ensureToken();
		this.speechify.setAccessToken(this.ttsToken.token);

		const toastId = toast.loading('Generating voice...');

		try {
			const response = await this.speechify.audioGenerate({
				input: text,
				voiceId: voiceId,
				audioFormat: 'mp3',
			});

			toast.dismiss(toastId);

			const audioBlob = new Blob([response.audioData], { type: 'audio/mpeg' });
			const audioUrl = URL.createObjectURL(audioBlob);

			const audioElement = new Audio(audioUrl);
			
			// Clean up blob URL when audio is done
			audioElement.addEventListener('ended', () => {
				URL.revokeObjectURL(audioUrl);
			});

			return audioElement;
		} catch (error) {
			toast.dismiss(toastId);
			console.error('Audio generation failed:', error);
			throw error;
		}
	}

	/**
	 * Estimate audio duration (rough calculation)
	 * @param text - Text to estimate duration for
	 * @returns Estimated duration in milliseconds
	 */
	static estimateDuration(text: string): number {
		// Rough estimate: ~150 words per minute, ~5 chars per word
		return Math.ceil((text.length / 5 / 150) * 60 * 1000);
	}
}
