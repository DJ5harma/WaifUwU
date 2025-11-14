import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true,
		minlength: 3,
		maxlength: 30
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	displayName: {
		type: String,
		default: function() {
			return this.username;
		}
	},
	avatar: {
		type: String,
		default: null
	},
	preferences: {
		waifuVoice: {
			type: String,
			default: 'kristy'
		},
		waifuPersonality: {
			type: String,
			enum: ['friendly', 'tsundere', 'kuudere', 'dandere', 'yandere'],
			default: 'friendly'
		},
		theme: {
			type: String,
			enum: ['purple', 'pink', 'blue', 'dark'],
			default: 'purple'
		},
		autoPlayAudio: {
			type: Boolean,
			default: true
		},
		showAnimations: {
			type: Boolean,
			default: true
		}
	},
	stats: {
		totalConversations: {
			type: Number,
			default: 0
		},
		totalMessages: {
			type: Number,
			default: 0
		},
		favoriteTopics: [{
			topic: String,
			count: Number
		}],
		lastActive: {
			type: Date,
			default: Date.now
		}
	},
	isActive: {
		type: Boolean,
		default: true
	},
}, {
	timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next();
	
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

// Update last active
userSchema.methods.updateLastActive = function() {
	this.stats.lastActive = new Date();
	return this.save();
};

// Increment message count
userSchema.methods.incrementMessageCount = function() {
	this.stats.totalMessages += 1;
	return this.save();
};

// Get public profile
userSchema.methods.toPublicJSON = function() {
	return {
		id: this._id,
		username: this.username,
		displayName: this.displayName,
		avatar: this.avatar,
		stats: {
			totalConversations: this.stats.totalConversations,
			totalMessages: this.stats.totalMessages
		},
		createdAt: this.createdAt
	};
};

export const User = mongoose.model('User', userSchema);
