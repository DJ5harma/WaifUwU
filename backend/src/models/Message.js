import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	conversationId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Conversation',
		required: true,
		index: true
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true
	},
	role: {
		type: String,
		enum: ['user', 'assistant', 'system'],
		required: true
	},
	content: {
		type: String,
		required: true,
		maxlength: 5000
	},
	metadata: {
		emotion: {
			type: String,
			enum: ['Idle', 'Talking', 'Shy', 'Angry', 'Greeting', 'Happy', 'Sad'],
			default: 'Idle'
		},
		audioUrl: {
			type: String,
			default: null
		},
		audioDuration: {
			type: Number,
			default: 0
		},
		tokens: {
			type: Number,
			default: 0
		},
		model: {
			type: String,
			default: 'gemini-1.5-flash'
		},
		cached: {
			type: Boolean,
			default: false
		}
	},
	reactions: [{
		type: {
			type: String,
			enum: ['like', 'love', 'laugh', 'sad', 'angry']
		},
		timestamp: {
			type: Date,
			default: Date.now
		}
	}],
	isEdited: {
		type: Boolean,
		default: false
	},
	editedAt: {
		type: Date,
		default: null
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	deletedAt: {
		type: Date,
		default: null
	}
}, {
	timestamps: true
});

// Index for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, createdAt: -1 });

// Soft delete method
messageSchema.methods.softDelete = function() {
	this.isDeleted = true;
	this.deletedAt = new Date();
	return this.save();
};

// Add reaction
messageSchema.methods.addReaction = function(reactionType) {
	this.reactions.push({ type: reactionType });
	return this.save();
};

export const Message = mongoose.model('Message', messageSchema);
