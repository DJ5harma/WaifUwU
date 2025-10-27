import mongoose from 'mongoose';

const personalitySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		enum: ['friendly', 'tsundere', 'kuudere', 'dandere', 'yandere']
	},
	displayName: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	systemPrompt: {
		type: String,
		required: true
	},
	traits: [{
		type: String
	}],
	emotionMapping: {
		happy: {
			triggers: [String],
			animation: {
				type: String,
				default: 'Greeting'
			}
		},
		shy: {
			triggers: [String],
			animation: {
				type: String,
				default: 'Shy'
			}
		},
		angry: {
			triggers: [String],
			animation: {
				type: String,
				default: 'Angry'
			}
		},
		sad: {
			triggers: [String],
			animation: {
				type: String,
				default: 'Idle'
			}
		}
	},
	voiceSettings: {
		preferredVoiceId: String,
		pitch: {
			type: Number,
			default: 1.0
		},
		speed: {
			type: Number,
			default: 1.0
		}
	},
	isPremium: {
		type: Boolean,
		default: false
	},
	isActive: {
		type: Boolean,
		default: true
	}
}, {
	timestamps: true
});

export const Personality = mongoose.model('Personality', personalitySchema);
