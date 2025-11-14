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
			password
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
 * POST /api/auth/logout
 * Logout (client-side token removal)
 */
router.post('/logout', authenticate, async (req, res) => {
	res.json({ message: 'Logged out successfully' });
});

export default router;
