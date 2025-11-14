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
		tokens: {
			type: Number,
			default: 0
		},
		cached: {
			type: Boolean,
			default: false
		}
	}
}, {
	timestamps: true
});

// Index for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);
