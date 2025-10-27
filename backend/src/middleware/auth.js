import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.replace('Bearer ', '');
		
		if (!token) {
			return res.status(401).json({ error: 'Authentication required' });
		}

		const decoded = jwt.verify(token, env.JWT_SECRET);
		const user = await User.findById(decoded.userId);

		if (!user || !user.isActive) {
			return res.status(401).json({ error: 'Invalid authentication' });
		}

		req.user = user;
		req.userId = user._id;
		next();
	} catch (error) {
		res.status(401).json({ error: 'Invalid token' });
	}
};

export const optionalAuth = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.replace('Bearer ', '');
		
		if (token) {
			const decoded = jwt.verify(token, env.JWT_SECRET);
			const user = await User.findById(decoded.userId);
			
			if (user && user.isActive) {
				req.user = user;
				req.userId = user._id;
			}
		}
		next();
	} catch (error) {
		next();
	}
};

export const requirePremium = (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({ error: 'Authentication required' });
	}

	if (req.user.subscription.tier === 'free') {
		return res.status(403).json({ 
			error: 'Premium subscription required',
			upgradeUrl: '/upgrade'
		});
	}

	next();
};

export const checkRateLimit = (req, res, next) => {
	// TODO: Implement rate limiting based on user tier
	next();
};
