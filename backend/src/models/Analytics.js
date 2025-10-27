import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
		index: true
	},
	date: {
		type: Date,
		required: true,
		index: true
	},
	metrics: {
		messagesent: {
			type: Number,
			default: 0
		},
		messagesReceived: {
			type: Number,
			default: 0
		},
		conversationsStarted: {
			type: Number,
			default: 0
		},
		totalTokensUsed: {
			type: Number,
			default: 0
		},
		audioGenerated: {
			type: Number,
			default: 0
		},
		averageResponseTime: {
			type: Number,
			default: 0
		},
		cacheHitRate: {
			type: Number,
			default: 0
		}
	},
	emotionBreakdown: {
		happy: { type: Number, default: 0 },
		shy: { type: Number, default: 0 },
		angry: { type: Number, default: 0 },
		sad: { type: Number, default: 0 },
		neutral: { type: Number, default: 0 }
	},
	topicsDiscussed: [{
		topic: String,
		count: Number
	}],
	peakUsageHour: {
		type: Number,
		min: 0,
		max: 23
	},
	sessionDuration: {
		type: Number,
		default: 0
	}
}, {
	timestamps: true
});

// Compound index for user and date
analyticsSchema.index({ userId: 1, date: -1 });

export const Analytics = mongoose.model('Analytics', analyticsSchema);
