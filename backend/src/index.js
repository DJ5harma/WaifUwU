import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { connectMongoDB, connectRedis } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = env.PORT;

// Middleware
app.use(cors({
	origin: env.FRONTEND_URL,
	credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static audio files
app.use('/audio', express.static(path.join(__dirname, '../public/audio')));

// Health check
app.get('/health', (req, res) => {
	res.json({ 
		status: 'ok', 
		timestamp: new Date().toISOString(),
		service: 'WaifUwU Backend',
		version: '2.0.0'
	});
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
	try {
		// Connect to MongoDB
		await connectMongoDB();
		
		// Connect to Redis (optional, continues if fails)
		await connectRedis();

		app.listen(PORT, () => {
			console.log(`
╔════════════════════════════════════════╗
║     🌸 WaifUwU Backend Server 🌸      ║
╠════════════════════════════════════════╣
║  Status: ✅ Running                    ║
║  Port: ${PORT}                           ║
║  Environment: ${env.NODE_ENV}              ║
╚════════════════════════════════════════╝
			`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

startServer();
