import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

export interface Message {
	_id?: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp: Date;
	audioUrl?: string | null;
}

export interface ChatResponse {
	sessionId: string;
	response: string;
	emotion: string;
	voiceId: string;
	audioUrl: string | null;
	duration: number;
	messageId: string;
}

export interface ConversationHistory {
	sessionId: string;
	messages: Message[];
	total: number;
}

export interface NewConversationResponse {
	conversation: {
		_id: string;
		personality: string;
		createdAt: Date;
	};
	message: Message;
}

export const chatAPI = {
	/**
	 * Send a message to the AI
	 */
	async sendMessage(message: string, conversationId?: string): Promise<ChatResponse> {
		const response = await api.post('/api/chat/message', {
			message,
			conversationId,
		});
		return response.data;
	},

	/**
	 * Get all conversations
	 */
	async getConversations(page = 1, limit = 20): Promise<unknown> {
		const response = await api.get('/api/chat/conversations', {
			params: { page, limit },
		});
		return response.data;
	},

	/**
	 * Get single conversation with messages
	 */
	async getConversation(conversationId: string): Promise<unknown> {
		const response = await api.get(`/api/chat/conversations/${conversationId}`);
		return response.data;
	},

	/**
	 * Start a new conversation
	 */
	async newConversation(personality = 'friendly'): Promise<NewConversationResponse> {
		const response = await api.post('/api/chat/conversations/new', { personality });
		return response.data;
	},

	/**
	 * Delete conversation
	 */
	async deleteConversation(conversationId: string): Promise<void> {
		await api.delete(`/api/chat/conversations/${conversationId}`);
	},

	/**
	 * Update conversation
	 */
	async updateConversation(conversationId: string, data: unknown): Promise<unknown> {
		const response = await api.put(`/api/chat/conversations/${conversationId}`, data);
		return response.data;
	},

	/**
	 * Get TTS token
	 */
	async getTTSToken(): Promise<{ token: string; expiry: number }> {
		const response = await api.get('/api/chat/tts-token');
		return response.data;
	},

	/**
	 * Get available voices
	 */
	async getVoices(): Promise<unknown[]> {
		const response = await api.get('/api/chat/voices');
		return response.data.voices;
	},

	/**
	 * Health check
	 */
	async healthCheck(): Promise<{ status: string; timestamp: string }> {
		const response = await api.get('/health');
		return response.data;
	},
};

export const authAPI = {
	/**
	 * Register new user
	 */
	async register(username: string, email: string, password: string): Promise<unknown> {
		const response = await api.post('/api/auth/register', {
			username,
			email,
			password,
		});
		return response.data;
	},

	/**
	 * Login user
	 */
	async login(email: string, password: string): Promise<unknown> {
		const response = await api.post('/api/auth/login', {
			email,
			password,
		});
		return response.data;
	},

	/**
	 * Create guest session
	 */
	async createGuest(): Promise<unknown> {
		const response = await api.post('/api/auth/guest');
		return response.data;
	},

	/**
	 * Get current user
	 */
	async getMe(): Promise<unknown> {
		const response = await api.get('/api/auth/me');
		return response.data;
	},

	/**
	 * Update profile
	 */
	async updateProfile(data: unknown): Promise<unknown> {
		const response = await api.put('/api/auth/profile', data);
		return response.data;
	},
};
