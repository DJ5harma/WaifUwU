/**
 * Valid emotion types that match the frontend WAIFU_ANIMATION_TYPE
 * These must match exactly: "Idle" | "Angry" | "Shy" | "Greeting" | "Talking"
 */
export const VALID_EMOTIONS = ['Idle', 'Angry', 'Shy', 'Greeting', 'Talking'];

/**
 * Default emotion fallback
 */
export const DEFAULT_EMOTION = 'Idle';

/**
 * Validate and normalize emotion to ensure it matches frontend types
 * @param {string} emotion - The emotion to validate
 * @returns {string} - A valid emotion from VALID_EMOTIONS
 */
export function validateEmotion(emotion) {
	if (!emotion || typeof emotion !== 'string') {
		return DEFAULT_EMOTION;
	}

	// Normalize: trim and capitalize first letter
	const normalized = emotion.trim();
	const capitalized = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();

	// Check if it's a valid emotion
	if (VALID_EMOTIONS.includes(capitalized)) {
		return capitalized;
	}

	// Fallback to default
	return DEFAULT_EMOTION;
}

