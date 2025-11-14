import express from 'express';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { User } from '../models/User.js';
import { aiService } from '../services/aiService.js';
import { speechifyService } from '../services/speechifyService.js';
import { cacheService } from '../services/cacheService.js';
import { audioStorageService } from '../services/audioStorageService.js';
import { authenticate } from '../middleware/auth.js';
import { validateEmotion } from '../utils/emotionValidator.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * POST /api/chat/message
 * Send a message and get AI response with audio
 */
router.post('/message', authenticate, async (req, res) => {
	const startTime = Date.now();
	
	try {
		const { message, conversationId, regenerate } = req.body;
		const userId = req.userId;

		if (!message || !message.trim()) {
			return res.status(400).json({ error: 'Message is required' });
		}

		if (!userId) {
			return res.status(401).json({ error: 'Authentication required' });
		}

		// Get or create conversation
		let conversation;
		
		if (conversationId) {
			conversation = await Conversation.findById(conversationId);
			if (!conversation || conversation.userId.toString() !== userId.toString()) {
				return res.status(404).json({ error: 'Conversation not found' });
			}
		} else {
			// Create new conversation
			conversation = new Conversation({
				userId,
				sessionId: crypto.randomUUID(),
				title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
			});
			await conversation.save();
		}

		// If regenerating, remove the last assistant message and matching user message
		if (regenerate) {
			const lastAssistantMessage = await Message.findOne({ 
				conversationId: conversation._id,
				role: 'assistant'
			}).sort({ createdAt: -1 });
			
			if (lastAssistantMessage) {
				await Message.deleteOne({ _id: lastAssistantMessage._id });
			}

			// Also remove the last user message if it matches the current message
			const lastUserMessage = await Message.findOne({ 
				conversationId: conversation._id,
				role: 'user',
				content: message.trim()
			}).sort({ createdAt: -1 });
			
			if (lastUserMessage) {
				await Message.deleteOne({ _id: lastUserMessage._id });
			}
		}

		// Create user message
		const userMessage = new Message({
			conversationId: conversation._id,
			userId,
			role: 'user',
			content: message.trim()
		});
		await userMessage.save();

		// Build conversation history (used for both cached and non-cached paths)
		const history = await Message.find({ 
			conversationId: conversation._id 
		})
		.sort({ createdAt: 1 })
		.limit(20)
		.select('role content');

		const conversationHistory = history.map(msg => ({
			role: msg.role,
			content: msg.content
		}));

		// Check cache (skip if regenerating)
		let aiResponse, emotion, tokens = 0;
		let cachedResponse = null;

		if (!regenerate) {
			const cacheKey = crypto.createHash('md5').update(message.toLowerCase().trim()).digest('hex');
			cachedResponse = await cacheService.getCachedResponse(cacheKey);

			if (cachedResponse && cachedResponse.timestamp > Date.now() - 300000) {
				// Use cached response (validate emotion to ensure it matches frontend types)
				({ text: aiResponse } = cachedResponse);
				emotion = validateEmotion(cachedResponse.emotion);
			}
		}

		// Generate new response if not cached or if regenerating
		if (!cachedResponse || regenerate) {
			// Generate AI response (uses configured provider: Gemini or Local AI)
			const aiResponseData = await aiService.generateResponse(
				conversationHistory,
				message,
				conversation.settings.personality
			);

			aiResponse = aiResponseData.text;
			emotion = aiResponseData.emotion;
			tokens = aiResponseData.tokens || 0;

			// Cache the response (unless regenerating, to allow different responses)
			if (!regenerate) {
				const cacheKey = crypto.createHash('md5').update(message.toLowerCase().trim()).digest('hex');
				await cacheService.cacheResponse(cacheKey, {
					text: aiResponse,
					emotion,
					timestamp: Date.now()
				});
			}
		}

		// Create assistant message (save first to get ID)
		const assistantMessage = new Message({
			conversationId: conversation._id,
			userId,
			role: 'assistant',
			content: aiResponse,
			metadata: {
				emotion,
				tokens,
				cached: !!cachedResponse
			}
		});
		await assistantMessage.save();

		// Audio will be generated and cached on frontend
		// Backend just provides the message ID for audio caching
		const audioUrl = null;

		// Update conversation stats
		const responseTime = Date.now() - startTime;
		await conversation.updateStats('assistant', tokens, responseTime);

		// Update user stats
		const user = await User.findById(userId);
		if (user) {
			await user.incrementMessageCount();
		}

		// Update cache
		await cacheService.setConversationContext(conversation.sessionId, [
			...conversationHistory,
			{ role: 'user', content: message },
			{ role: 'assistant', content: aiResponse }
		]);

		res.json({
			conversationId: conversation._id,
			sessionId: conversation.sessionId,
			response: aiResponse,
			emotion,
			voiceId: conversation.settings.voice,
			messageId: assistantMessage._id,
			audioUrl,
			cached: !!cachedResponse,
			responseTime
		});

	} catch (error) {
		console.error('Chat error:', error);
		res.status(500).json({ 
			error: 'Failed to process message',
			details: error.message 
		});
	}
});

/**
 * GET /api/chat/conversations
 * Get all conversations for user
 */
router.get('/conversations', authenticate, async (req, res) => {
	try {
		const { page = 1, limit = 20, archived = false } = req.query;
		
		const conversations = await Conversation.find({
			userId: req.userId,
			isArchived: archived === 'true'
		})
		.sort({ isPinned: -1, 'stats.lastActive': -1 })
		.skip((page - 1) * limit)
		.limit(parseInt(limit))
		.select('-sharedWith');

		const total = await Conversation.countDocuments({
			userId: req.userId,
			isArchived: archived === 'true'
		});

		res.json({
			conversations,
			total,
			page: parseInt(page),
			limit: parseInt(limit)
		});

	} catch (error) {
		console.error('Fetch conversations error:', error);
		res.status(500).json({ error: 'Failed to fetch conversations' });
	}
});

/**
 * GET /api/chat/conversations/:id
 * Get single conversation with messages
 */
router.get('/conversations/:id', authenticate, async (req, res) => {
	try {
		const conversation = await Conversation.findOne({
			_id: req.params.id,
			userId: req.userId
		});

		if (!conversation) {
			return res.status(404).json({ error: 'Conversation not found' });
		}

		const messages = await Message.find({
			conversationId: conversation._id,
			isDeleted: false
		})
		.sort({ createdAt: 1 })
		.select('-__v');

		res.json({
			conversation,
			messages
		});

	} catch (error) {
		console.error('Fetch conversation error:', error);
		res.status(500).json({ error: 'Failed to fetch conversation' });
	}
});

/**
 * DELETE /api/chat/conversations/:id
 * Delete conversation
 */
router.delete('/conversations/:id', authenticate, async (req, res) => {
	try {
		const conversation = await Conversation.findOne({
			_id: req.params.id,
			userId: req.userId
		});

		if (!conversation) {
			return res.status(404).json({ error: 'Conversation not found' });
		}

		// Delete all messages
		await Message.deleteMany({ conversationId: conversation._id });
		
		// Delete conversation
		await conversation.deleteOne();
		
		// Clear cache
		await cacheService.clearConversation(conversation.sessionId);

		res.json({ success: true, message: 'Conversation deleted' });

	} catch (error) {
		console.error('Delete conversation error:', error);
		res.status(500).json({ error: 'Failed to delete conversation' });
	}
});

/**
 * PUT /api/chat/conversations/:id
 * Update conversation (title, settings, etc)
 */
router.put('/conversations/:id', authenticate, async (req, res) => {
	try {
		const conversation = await Conversation.findOne({
			_id: req.params.id,
			userId: req.userId
		});

		if (!conversation) {
			return res.status(404).json({ error: 'Conversation not found' });
		}

		const { title, tags, settings } = req.body;

		if (title) conversation.title = title;
		if (tags) conversation.tags = tags;
		if (settings) conversation.settings = { ...conversation.settings, ...settings };

		await conversation.save();

		res.json({ conversation });

	} catch (error) {
		console.error('Update conversation error:', error);
		res.status(500).json({ error: 'Failed to update conversation' });
	}
});

/**
 * POST /api/chat/conversations/:id/pin
 * Toggle pin conversation
 */
router.post('/conversations/:id/pin', authenticate, async (req, res) => {
	try {
		const conversation = await Conversation.findOne({
			_id: req.params.id,
			userId: req.userId
		});

		if (!conversation) {
			return res.status(404).json({ error: 'Conversation not found' });
		}

		await conversation.togglePin();

		res.json({ 
			success: true, 
			isPinned: conversation.isPinned 
		});

	} catch (error) {
		res.status(500).json({ error: 'Failed to pin conversation' });
	}
});

/**
 * POST /api/chat/conversations/:id/archive
 */
router.post('/conversations/:id/archive', authenticate, async (req, res) => {
	try {
		const conversation = await Conversation.findOne({
			_id: req.params.id,
			userId: req.userId
		});

		if (!conversation) {
			return res.status(404).json({ error: 'Conversation not found' });
		}

		await conversation.archive();

		res.json({ success: true });

	} catch (error) {
		res.status(500).json({ error: 'Failed to archive conversation' });
	}
});

/**
 * POST /api/chat/conversations/new
 * Start a new conversation
 */
router.post('/conversations/new', authenticate, async (req, res) => {
	try {
		const { personality = 'friendly', voice } = req.body;
		
		const conversation = new Conversation({
			userId: req.userId,
			sessionId: crypto.randomUUID(),
			title: 'New Conversation',
			settings: {
				personality,
				voice: voice || req.user.preferences.waifuVoice
			}
		});

		await conversation.save();

		// Create welcome message
		const welcomeMessage = new Message({
			conversationId: conversation._id,
			userId: req.userId,
			role: 'assistant',
			content: "Hi there! I'm your AI waifu assistant. How can I help you today? 💫"
		});
		await welcomeMessage.save();

		res.json({
			conversation,
			message: welcomeMessage
		});

	} catch (error) {
		console.error('New conversation error:', error);
		res.status(500).json({ error: 'Failed to create conversation' });
	}
});

/**
 * GET /api/chat/tts-token
 * Get Speechify access token for frontend
 */
router.get('/tts-token', authenticate, async (req, res) => {
	try {
		const tokenData = await speechifyService.issueAccessToken('audio:all');
		
		res.json({
			token: tokenData.accessToken,
			expiry: Date.now() + (tokenData.expiresIn * 1000) // Convert to milliseconds
		});
	} catch (error) {
		console.error('TTS token error:', error);
		res.status(500).json({ error: 'Failed to issue TTS token' });
	}
});

/**
 * GET /api/chat/voices
 * Get available TTS voices
 */
router.get('/voices', authenticate, async (req, res) => {
	try {
		const voices = await speechifyService.getVoices();
		res.json({ voices });
	} catch (error) {
		console.error('Voices fetch error:', error);
		res.status(500).json({ error: 'Failed to fetch voices' });
	}
});

export default router;
