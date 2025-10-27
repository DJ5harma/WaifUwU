import { getRedisClient } from '../config/database.js';

export class CacheService {
	constructor() {
		this.defaultTTL = 3600; // 1 hour
	}

	/**
	 * Get cached conversation context
	 * @param {string} sessionId 
	 * @returns {Promise<Array|null>}
	 */
	async getConversationContext(sessionId) {
		const client = getRedisClient();
		if (!client) return null;

		try {
			const cached = await client.get(`conversation:${sessionId}`);
			return cached ? JSON.parse(cached) : null;
		} catch (error) {
			console.error('Redis get error:', error);
			return null;
		}
	}

	/**
	 * Cache conversation context
	 * @param {string} sessionId 
	 * @param {Array} messages 
	 * @param {number} ttl - Time to live in seconds
	 */
	async setConversationContext(sessionId, messages, ttl = this.defaultTTL) {
		const client = getRedisClient();
		if (!client) return;

		try {
			// Keep only last 20 messages for context
			const contextMessages = messages.slice(-20);
			await client.setEx(
				`conversation:${sessionId}`,
				ttl,
				JSON.stringify(contextMessages)
			);
		} catch (error) {
			console.error('Redis set error:', error);
		}
	}

	/**
	 * Cache AI response to avoid regenerating for same input
	 * @param {string} key 
	 * @param {any} value 
	 * @param {number} ttl 
	 */
	async cacheResponse(key, value, ttl = 1800) {
		const client = getRedisClient();
		if (!client) return;

		try {
			await client.setEx(
				`response:${key}`,
				ttl,
				JSON.stringify(value)
			);
		} catch (error) {
			console.error('Redis cache error:', error);
		}
	}

	/**
	 * Get cached response
	 * @param {string} key 
	 * @returns {Promise<any|null>}
	 */
	async getCachedResponse(key) {
		const client = getRedisClient();
		if (!client) return null;

		try {
			const cached = await client.get(`response:${key}`);
			return cached ? JSON.parse(cached) : null;
		} catch (error) {
			console.error('Redis get error:', error);
			return null;
		}
	}

	/**
	 * Clear conversation cache
	 * @param {string} sessionId 
	 */
	async clearConversation(sessionId) {
		const client = getRedisClient();
		if (!client) return;

		try {
			await client.del(`conversation:${sessionId}`);
		} catch (error) {
			console.error('Redis delete error:', error);
		}
	}

	/**
	 * Get cache statistics
	 * @returns {Promise<Object>}
	 */
	async getStats() {
		const client = getRedisClient();
		if (!client) return { connected: false };

		try {
			const info = await client.info('stats');
			return {
				connected: true,
				info
			};
		} catch (error) {
			return { connected: false, error: error.message };
		}
	}
}

export const cacheService = new CacheService();
