import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Validate required environment variables
// AI_PROVIDER can be 'gemini' or 'local'/'ollama'
const aiProvider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
const requiredEnvVars = [
	'SPEECHIFY_API_KEY',
	'MONGO_URI',
	'JWT_SECRET'
];

// Only require GEMINI_API_KEY if using Gemini
if (aiProvider === 'gemini') {
	requiredEnvVars.push('GEMINI_API_KEY');
}

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
	console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
	console.error('Please check your .env file');
	process.exit(1);
}

// Export validated environment configuration
export const env = {
	// AI Provider Configuration
	AI_PROVIDER: aiProvider, // 'gemini' or 'local'/'ollama'
	
	// API Keys
	GEMINI_API_KEY: process.env.GEMINI_API_KEY,
	SPEECHIFY_API_KEY: process.env.SPEECHIFY_API_KEY,
	
	// Local AI Configuration (Ollama)
	OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
	OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'llama3.2',
	
	// Database
	MONGO_URI: process.env.MONGO_URI,
	REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
	
	// Auth
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
	
	// Server
	PORT: process.env.PORT || 4000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

console.log('✅ Environment variables loaded and validated');
console.log(`🤖 AI Provider: ${env.AI_PROVIDER}`);
if (env.AI_PROVIDER === 'local' || env.AI_PROVIDER === 'ollama') {
	console.log(`   Ollama URL: ${env.OLLAMA_URL}`);
	console.log(`   Ollama Model: ${env.OLLAMA_MODEL}`);
}
