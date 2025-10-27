import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// Validation
		if (!username || !email || !password) {
			return res.status(400).json({ error: 'All fields are required' });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: 'Password must be at least 6 characters' });
		}

		// Check if user exists
		const existingUser = await User.findOne({ 
			$or: [{ email }, { username }] 
		});

		if (existingUser) {
			return res.status(400).json({ 
				error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
			});
		}

		// Create user
		const user = new User({
			username,
			email,
			password,
			verificationToken: crypto.randomBytes(32).toString('hex')
		});

		await user.save();

		// Generate token
		const token = jwt.sign(
			{ userId: user._id },
			env.JWT_SECRET,
			{ expiresIn: env.JWT_EXPIRE }
		);

		res.status(201).json({
			token,
			user: user.toPublicJSON()
		});

	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ error: 'Registration failed' });
	}
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password required' });
		}

		// Find user
		const user = await User.findOne({ email: email.toLowerCase() });

		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		// Check password
		const isMatch = await user.comparePassword(password);

		if (!isMatch) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}

		if (!user.isActive) {
			return res.status(403).json({ error: 'Account is deactivated' });
		}

		// Update last active
		await user.updateLastActive();

		// Generate token
		const token = jwt.sign(
			{ userId: user._id },
			env.JWT_SECRET,
			{ expiresIn: env.JWT_EXPIRE }
		);

		res.json({
			token,
			user: user.toPublicJSON()
		});

	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ error: 'Login failed' });
	}
});

/**
 * POST /api/auth/guest
 * Create guest session
 */
router.post('/guest', async (req, res) => {
	try {
		const guestId = `guest_${crypto.randomBytes(16).toString('hex')}`;
		
		const user = new User({
			username: guestId,
			email: `${guestId}@guest.local`,
			password: crypto.randomBytes(32).toString('hex'),
			displayName: 'Guest User',
			subscription: {
				tier: 'free',
				features: {
					maxConversationsPerDay: 10,
					maxMessagesPerConversation: 50
				}
			}
		});

		await user.save();

		const token = jwt.sign(
			{ userId: user._id, isGuest: true },
			env.JWT_SECRET,
			{ expiresIn: '24h' }
		);

		res.json({
			token,
			user: user.toPublicJSON(),
			isGuest: true
		});

	} catch (error) {
		console.error('Guest creation error:', error);
		res.status(500).json({ error: 'Failed to create guest session' });
	}
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticate, async (req, res) => {
	try {
		res.json({
			user: req.user.toPublicJSON()
		});
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch user' });
	}
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', authenticate, async (req, res) => {
	try {
		const { displayName, avatar, preferences } = req.body;

		if (displayName) req.user.displayName = displayName;
		if (avatar) req.user.avatar = avatar;
		if (preferences) {
			req.user.preferences = { ...req.user.preferences, ...preferences };
		}

		await req.user.save();

		res.json({
			user: req.user.toPublicJSON()
		});

	} catch (error) {
		console.error('Profile update error:', error);
		res.status(500).json({ error: 'Failed to update profile' });
	}
});

/**
 * POST /api/auth/change-password
 * Change password
 */
router.post('/change-password', authenticate, async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(400).json({ error: 'Both passwords required' });
		}

		const isMatch = await req.user.comparePassword(currentPassword);

		if (!isMatch) {
			return res.status(401).json({ error: 'Current password is incorrect' });
		}

		if (newPassword.length < 6) {
			return res.status(400).json({ error: 'New password must be at least 6 characters' });
		}

		req.user.password = newPassword;
		await req.user.save();

		res.json({ message: 'Password changed successfully' });

	} catch (error) {
		console.error('Password change error:', error);
		res.status(500).json({ error: 'Failed to change password' });
	}
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal)
 */
router.post('/logout', authenticate, async (req, res) => {
	res.json({ message: 'Logged out successfully' });
});

export default router;
