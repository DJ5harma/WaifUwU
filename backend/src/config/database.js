import mongoose from 'mongoose';
import { createClient } from 'redis';
import { env } from './env.js';

let redisClient = null;

export const connectMongoDB = async () => {
	try {
		await mongoose.connect(env.MONGO_URI);
		console.log('✅ MongoDB connected successfully');
	} catch (error) {
		console.error('❌ MongoDB connection error:', error);
		process.exit(1);
	}
};

export const connectRedis = async () => {
	try {
		redisClient = createClient({
			url: env.REDIS_URL
		});

		redisClient.on('error', (err) => console.error('Redis Client Error', err));
		redisClient.on('connect', () => console.log('✅ Redis connected successfully'));

		await redisClient.connect();
		return redisClient;
	} catch (error) {
		console.error('❌ Redis connection error:', error);
		// Continue without Redis if it fails
		return null;
	}
};

export const getRedisClient = () => redisClient;
