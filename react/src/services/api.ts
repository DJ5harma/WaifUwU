import axios from 'axios';
import { WAIFU_ANIMATION_TYPE } from '../Providers/WaifuProvider';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('authToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export interface Message {
	_id?: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	timestamp: Date;
	audioUrl?: string | null;
}

export interface BackendMessage {
	_id: string;
	role: 'user' | 'assistant' | 'system';
	content: string;
	createdAt: string;
	timestamp?: string;
	metadata?: {
		audioUrl?: string | null;
		emotion?: WAIFU_ANIMATION_TYPE;
		tokens?: number;
		cached?: boolean;
	};
}

export interface ChatResponse {
	conversationId: string;
	sessionId: string;
	response: string;
	emotion: WAIFU_ANIMATION_TYPE;
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
		title: string;
		createdAt: Date;
	};
	message: Message;
}

export interface User {
	_id: string;
	username: string;
	email: string;
	displayName?: string;
	avatar?: string;
	subscription: {
		tier: 'free' | 'premium' | 'pro';
		features: {
			maxConversationsPerDay: number;
			maxMessagesPerConversation: number;
		};
	};
	preferences?: {
		defaultPersonality?: string;
		defaultVoice?: string;
		theme?: string;
	};
	createdAt: Date;
	lastActive: Date;
}

export interface AuthResponse {
	token: string;
	user: User;
	isGuest?: boolean;
}

export interface UserResponse {
	user: User;
}

export interface ConversationsResponse {
	conversations: Array<{
		_id: string;
		title: string;
		lastMessage?: string;
		updatedAt: Date;
		createdAt: Date;
	}>;
	total: number;
	page: number;
	limit: number;
}

export interface ConversationDetailResponse {
	conversation: {
		_id: string;
		title: string;
		createdAt: Date;
	};
	messages: BackendMessage[];
}

export interface Voice {
	id: string;
	name: string;
	language: string;
	gender?: string;
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
	async getConversations(page = 1, limit = 20): Promise<ConversationsResponse> {
		const response = await api.get('/api/chat/conversations', {
			params: { page, limit },
		});
		return response.data;
	},

	/**
	 * Get single conversation with messages
	 */
	async getConversation(conversationId: string): Promise<ConversationDetailResponse> {
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
	async updateConversation(
		conversationId: string,
		data: { personality?: string }
	): Promise<ConversationDetailResponse> {
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
	async getVoices(): Promise<Voice[]> {
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
	async register(username: string, email: string, password: string): Promise<AuthResponse> {
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
	async login(email: string, password: string): Promise<AuthResponse> {
		const response = await api.post('/api/auth/login', {
			email,
			password,
		});
		return response.data;
	},

	/**
	 * Create guest session
	 */
	async createGuest(): Promise<AuthResponse> {
		const response = await api.post('/api/auth/guest');
		return response.data;
	},

	/**
	 * Get current user
	 */
	async getMe(): Promise<UserResponse> {
		const response = await api.get('/api/auth/me');
		return response.data;
	},

	/**
	 * Update profile
	 */
	async updateProfile(data: Partial<Pick<User, 'displayName' | 'avatar' | 'preferences'>>): Promise<UserResponse> {
		const response = await api.put('/api/auth/profile', data);
		return response.data;
	},
};
