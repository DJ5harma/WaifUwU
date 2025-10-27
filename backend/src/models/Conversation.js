import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true
	},
	sessionId: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	title: {
		type: String,
		default: 'New Conversation',
		maxlength: 100
	},
	summary: {
		type: String,
		default: '',
		maxlength: 500
	},
	tags: [{
		type: String,
		trim: true
	}],
	settings: {
		personality: {
			type: String,
			enum: ['friendly', 'tsundere', 'kuudere', 'dandere', 'yandere'],
			default: 'friendly'
		},
		voice: {
			type: String,
			default: 'kristy'
		},
		temperature: {
			type: Number,
			min: 0,
			max: 2,
			default: 0.7
		},
		maxTokens: {
			type: Number,
			default: 1000
		}
	},
	stats: {
		messageCount: {
			type: Number,
			default: 0
		},
		userMessageCount: {
			type: Number,
			default: 0
		},
		assistantMessageCount: {
			type: Number,
			default: 0
		},
		totalTokens: {
			type: Number,
			default: 0
		},
		averageResponseTime: {
			type: Number,
			default: 0
		},
		lastActive: {
			type: Date,
			default: Date.now
		}
	},
	isPinned: {
		type: Boolean,
		default: false
	},
	isArchived: {
		type: Boolean,
		default: false
	},
	isFavorite: {
		type: Boolean,
		default: false
	},
	sharedWith: [{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		permission: {
			type: String,
			enum: ['view', 'edit'],
			default: 'view'
		},
		sharedAt: {
			type: Date,
			default: Date.now
		}
	}]
}, {
	timestamps: true
});

// Indexes for efficient queries
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ userId: 1, isPinned: -1, 'stats.lastActive': -1 });
conversationSchema.index({ 'stats.lastActive': 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

// Update stats
conversationSchema.methods.updateStats = function(messageRole, tokens, responseTime) {
	this.stats.messageCount += 1;
	if (messageRole === 'user') this.stats.userMessageCount += 1;
	if (messageRole === 'assistant') this.stats.assistantMessageCount += 1;
	this.stats.totalTokens += tokens || 0;
	
	// Update average response time
	if (responseTime) {
		const currentAvg = this.stats.averageResponseTime;
		const count = this.stats.assistantMessageCount;
		this.stats.averageResponseTime = ((currentAvg * (count - 1)) + responseTime) / count;
	}
	
	this.stats.lastActive = new Date();
	return this.save();
};

// Generate title from first message
conversationSchema.methods.generateTitle = async function() {
	const Message = mongoose.model('Message');
	const firstMessage = await Message.findOne({ 
		conversationId: this._id,
		role: 'user'
	}).sort({ createdAt: 1 });
	
	if (firstMessage) {
		this.title = firstMessage.content.substring(0, 50) + (firstMessage.content.length > 50 ? '...' : '');
		return this.save();
	}
};

// Archive conversation
conversationSchema.methods.archive = function() {
	this.isArchived = true;
	return this.save();
};

// Pin conversation
conversationSchema.methods.togglePin = function() {
	this.isPinned = !this.isPinned;
	return this.save();
};

// Toggle favorite
conversationSchema.methods.toggleFavorite = function() {
	this.isFavorite = !this.isFavorite;
	return this.save();
};

export const Conversation = mongoose.model('Conversation', conversationSchema);
