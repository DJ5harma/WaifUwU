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


