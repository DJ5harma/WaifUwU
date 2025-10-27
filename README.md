# 🌸 WaifUwU - AI Talking Waifu Chatbot 🌸

A stunning 3D interactive AI chatbot featuring a cute animated waifu powered by Google Gemini AI and Speechify text-to-speech. She talks, animates, and responds intelligently to your messages!

## ✨ Features

- 🤖 **ChatGPT-like Intelligence**: Powered by Google Gemini 1.5 Flash
- 🎙️ **Voice Synthesis**: Natural speech using Speechify SDK
- 🎭 **Dynamic Animations**: 5 different animations (Idle, Talking, Shy, Angry, Greeting)
- 💾 **Conversation Memory**: MongoDB for persistent chat history
- ⚡ **Redis Caching**: Fast response times with intelligent caching
- 🎨 **Beautiful UI**: Modern gradient design that doesn't cover the waifu
- 🔄 **Real-time Sync**: Audio playback synchronized with talking animation

## 🏗️ Tech Stack

### Backend
- Node.js + Express
- Google Generative AI (Gemini)
- Speechify API SDK
- MongoDB (Mongoose)
- Redis
- CORS enabled

### Frontend
- React 19 + TypeScript
- Vite
- Three.js + React Three Fiber
- TailwindCSS
- Axios
- React Toastify

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- MongoDB (running locally or cloud instance)
- Redis (running locally or cloud instance)
- Google Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))
- Speechify API Key ([Get it here](https://speechify.com/api))

## 🚀 Installation

### 1. Clone the repository

```bash
cd WaifUwU
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from template:

```bash
copy .env.example .env
```

Edit `.env` and add your API keys:

```env
MONGO_URI=mongodb://localhost:27017/ai-talking-robot
JWT_SECRET=your-secret-key-change-this
GEMINI_API_KEY=your-gemini-api-key-here
SPEECHIFY_API_KEY=your-speechify-api-key-here
REDIS_URL=redis://localhost:6379
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../react
npm install
```

Create `.env` file:

```bash
copy .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:4000
```

### 4. Start MongoDB and Redis

**MongoDB:**
```bash
# If using local MongoDB
mongod
```

**Redis:**
```bash
# If using local Redis
redis-server
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd react
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎮 Usage

1. Open the application in your browser
2. The waifu will greet you with an animation
3. Use the chat panel on the right to send messages
4. She will respond with:
   - Intelligent AI-generated text (Gemini)
   - Voice synthesis (Speechify)
   - Synchronized talking animation
   - Emotion-based animations

### Chat Controls

- **Send Message**: Type and press Enter or click send button
- **Clear Chat**: Click trash icon to start fresh conversation
- **Minimize**: Click minimize icon to hide chat panel
- **Maximize**: Click floating button to restore chat panel

## 🎨 Animations

The waifu has 5 different animations:

- **Greeting**: Initial welcome animation
- **Idle**: Default resting state
- **Talking**: Plays during speech synthesis
- **Shy**: Triggered by shy/embarrassed responses
- **Angry**: Triggered by frustrated responses

## 🔧 API Endpoints

### Chat Endpoints

- `POST /api/chat/message` - Send a message
- `GET /api/chat/history/:sessionId` - Get conversation history
- `POST /api/chat/new` - Start new conversation
- `DELETE /api/chat/session/:sessionId` - Clear conversation
- `GET /api/chat/voices` - Get available TTS voices

### Health Check

- `GET /health` - Server health status

## 📁 Project Structure

```
WaifUwU/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB & Redis setup
│   │   ├── models/
│   │   │   └── Conversation.js      # Chat history model
│   │   ├── services/
│   │   │   ├── geminiService.js     # AI response generation
│   │   │   ├── speechifyService.js  # Text-to-speech
│   │   │   └── cacheService.js      # Redis caching
│   │   ├── routes/
│   │   │   └── chatRoutes.js        # API routes
│   │   ├── middleware/
│   │   │   └── errorHandler.js      # Error handling
│   │   └── index.js                 # Main server
│   └── package.json
├── react/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Avatar.tsx           # 3D model component
│   │   │   ├── Waifu.tsx            # 3D scene
│   │   │   └── ChatInterface.tsx    # Chat UI
│   │   ├── Providers/
│   │   │   └── WaifuProvider.tsx    # Animation state
│   │   ├── services/
│   │   │   └── api.ts               # API client
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## 🎯 Features Breakdown

### Intelligent Conversation
- Context-aware responses using conversation history
- Personality system with cute, friendly waifu character
- Emotion detection for appropriate animations

### Voice & Animation Sync
- Audio generated from AI responses
- Talking animation plays during speech
- Smooth transitions between emotion states
- Fallback handling if audio fails

### Performance Optimization
- Redis caching for frequent queries
- Response caching to avoid duplicate API calls
- Conversation context limited to last 20 messages
- Auto-cleanup of old conversations (30 days)

### User Experience
- Minimizable chat interface
- Conversation history persistence
- Clear conversation option
- Loading states and error handling
- Toast notifications for feedback

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If not, start it
mongod
```

### Redis Connection Issues
```bash
# Check if Redis is running
redis-cli ping

# Should return PONG
# If not, start it
redis-server
```

### API Key Issues
- Ensure your Gemini API key is valid and has quota
- Ensure your Speechify API key is active
- Check `.env` files are properly configured

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=4001

# Update VITE_API_URL in react/.env
VITE_API_URL=http://localhost:4001
```

## 🌟 Customization

### Change Waifu Voice
Edit `backend/src/services/speechifyService.js`:
```javascript
voiceId: 'your-preferred-voice-id'
```

### Modify Personality
Edit `backend/src/services/geminiService.js`:
```javascript
const WAIFU_SYSTEM_PROMPT = `Your custom personality here...`;
```

### Adjust Animation Timing
Edit `react/src/Components/ChatInterface.tsx`:
```typescript
// Greeting duration
setTimeout(() => setCurrentAnimation("Idle"), 3000);
```

## 📝 License

MIT License - feel free to use this project for learning and personal use!

## 🙏 Credits

- 3D Model: Ready Player Me
- AI: Google Gemini
- TTS: Speechify
- Animations: Mixamo

## 💖 Support

If you found this project helpful, give it a ⭐!

---

Made with 💜 by DJ5harma
