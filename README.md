<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7b7d357c-48b5-473d-beba-ba1fb3d21fb9" />

https://github.com/user-attachments/assets/7608965d-f700-49b8-94ff-6e018d22a374

# 🌸 WaifUwU - AI Waifu Chat Assistant

An interactive AI chat application featuring a fully animated 3D waifu character powered by Google Gemini AI and Speechify text-to-speech. Built with React Three Fiber, Express.js, and MongoDB for a modern, immersive conversational experience.

![WaifUwU](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-19.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)

## ✨ Features

### 🎭 3D Animated Character
- **React Three Fiber** - High-performance 3D rendering with Three.js
- **Ready Player Me Avatar** - Customizable 3D character model
- **5 Emotion-Based Animations** - Idle, Talking, Shy, Angry, and Greeting animations using FBX files
- **Smooth Animation Transitions** - Seamless blending between animation states
- **Interactive Controls** - OrbitControls for camera manipulation

### 🤖 AI-Powered Conversations
- **Google Gemini AI** - Advanced language model with structured output
- **5 Personality Types** - Choose between Friendly, Tsundere, Kuudere, Dandere, or Yandere personalities
- **Emotion Detection** - AI automatically selects appropriate character animations
- **Context-Aware Responses** - Maintains conversation history (last 20 messages)
- **Response Caching** - Redis-based caching for frequently asked questions

### 🎵 Text-to-Speech System
- **Speechify API Integration** - High-quality voice synthesis
- **Multiple Voice Options** - Select from various voice profiles
- **Frontend Audio Generation** - Client-side TTS with access tokens
- **Audio Caching** - Efficient audio storage and retrieval
- **Custom Audio Player** - Built-in player with playback controls

### 🔐 User Authentication
- **JWT-based Authentication** - Secure token-based auth system
- **User Registration & Login** - Complete auth flow with bcrypt password hashing
- **Session Persistence** - Maintain login state across sessions
- **Protected Routes** - Middleware-based route protection
- **Optional Authentication** - Some features work without login

### 💬 Conversation Management
- **Multi-Conversation Support** - Create and manage multiple chat sessions
- **Conversation Persistence** - MongoDB storage for all conversations
- **Pagination** - Efficient loading of conversation lists
- **Pin Conversations** - Pin important chats to the top
- **Archive Conversations** - Archive old conversations
- **Auto-Generated Titles** - Conversations titled from first message
- **Conversation Settings** - Per-conversation personality and voice settings

### 🎨 Modern UI/UX
- **TailwindCSS 4.0** - Modern utility-first styling
- **Animated Background** - Dynamic gradient background with floating orbs
- **Glassmorphism Design** - Frosted glass effects throughout
- **React Toastify** - Beautiful toast notifications
- **Responsive Layout** - Mobile-friendly design
- **Sidebar Navigation** - Collapsible conversation sidebar

### ⚡ Performance Optimizations
- **Redis Caching** - Response and context caching
- **Audio Storage Service** - Efficient audio file management
- **Lazy Loading** - Suspense-based component loading
- **Optimized Queries** - MongoDB query optimization
- **Error Handling** - Comprehensive error handling middleware

## 🛠️ Tech Stack

### Frontend
- **React 19.0** - Latest React with concurrent features
- **TypeScript 5.7** - Type-safe development
- **Vite 6.2** - Next-generation build tool
- **React Three Fiber 9.0** - React renderer for Three.js
- **@react-three/drei 10.0** - Useful helpers for R3F
- **Three.js 0.174** - 3D graphics library
- **TailwindCSS 4.0** - Utility-first CSS framework
- **React Router 7.2** - Client-side routing
- **React Toastify 11.0** - Toast notifications
- **React Icons 5.5** - Icon library
- **Axios 1.8** - HTTP client
- **Speechify API SDK 2.4** - Text-to-speech integration

### Backend
- **Node.js 20+** - JavaScript runtime with ES modules
- **Express.js 5.1** - Web application framework
- **MongoDB 8.19** - NoSQL database
- **Mongoose 8.19** - MongoDB ODM
- **Redis 5.9** - In-memory caching
- **JWT 9.0** - JSON Web Tokens
- **bcrypt 6.0** - Password hashing
- **Google Generative AI 0.24** - Gemini AI SDK
- **Speechify API SDK 2.5** - Server-side TTS
- **CORS 2.8** - Cross-origin resource sharing
- **dotenv 16.6** - Environment variable management

## 📦 Installation

### Prerequisites
- **Node.js 20+** - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Redis** (Optional) - [Download](https://redis.io/download) for caching
- **Google Gemini API Key** - [Get API Key](https://makersuite.google.com/app/apikey)
- **Speechify API Key** - [Get API Key](https://speechify.com/api)

### Quick Start

#### 1. Clone the Repository
```bash
git clone https://github.com/DJ5harma/WaifUwU.git
cd WaifUwU
```

#### 2. Install All Dependencies
```bash
npm run setup
```

#### 3. Configure Backend Environment
Create `backend/.env`:
```env
# Server Configuration
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/waifuwu

# Redis (Optional - app works without it)
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
SPEECHIFY_API_KEY=your_speechify_api_key_here
```

#### 4. Configure Frontend Environment
Create `react/.env`:
```env
VITE_API_URL=http://localhost:4000
```

#### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

#### 6. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

## 🚀 Usage Guide

### Getting Started
1. **Register** - Create a new account with email and password
2. **Login** - Sign in to access all features
3. **Start Chatting** - Type a message and watch your waifu respond!

### Conversation Features
- **New Conversation** - Click "New Chat" to start fresh
- **Switch Conversations** - Click any conversation in the sidebar
- **Delete Conversation** - Remove unwanted chats
- **Pin Conversations** - Keep important chats at the top
- **Archive Conversations** - Hide old conversations

### Personality Selection
Choose from 5 distinct personalities:
- **Friendly** - Cheerful, supportive, and warm
- **Tsundere** - Tough exterior, caring interior
- **Kuudere** - Calm, composed, and analytical
- **Dandere** - Shy, gentle, and sweet
- **Yandere** - Devoted, protective, and possessive

### Voice Customization
- Access voice settings through the chat interface
- Select from multiple Speechify voice profiles
- Voice preference saved per conversation

## 📁 Project Structure

```
WaifUwU/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # MongoDB & Redis connection
│   │   │   └── env.js            # Environment configuration
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT authentication
│   │   │   └── errorHandler.js  # Error handling
│   │   ├── models/
│   │   │   ├── User.js           # User schema
│   │   │   ├── Conversation.js   # Conversation schema
│   │   │   ├── Message.js        # Message schema
│   │   │   ├── Personality.js    # Personality schema
│   │   │   └── Analytics.js      # Analytics schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js     # Auth endpoints
│   │   │   └── chatRoutes.js     # Chat endpoints
│   │   ├── services/
│   │   │   ├── geminiService.js  # Gemini AI integration
│   │   │   ├── speechifyService.js # TTS integration
│   │   │   ├── cacheService.js   # Redis caching
│   │   │   └── audioStorageService.js # Audio management
│   │   └── index.js              # Server entry point
│   ├── public/
│   │   └── audio/                # Generated audio files
│   ├── package.json
│   └── ENV_CONFIG.md             # Environment setup guide
├── react/
│   ├── src/
│   │   ├── Components/
│   │   │   ├── AnimatedBackground.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   ├── Avatar.tsx        # 3D character component
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── ConversationSidebar.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── Waifu.tsx         # 3D scene setup
│   │   ├── Providers/
│   │   │   ├── AuthProvider.tsx  # Auth context
│   │   │   └── WaifuProvider.tsx # Animation state
│   │   ├── hooks/
│   │   │   └── useAuth.ts        # Auth hook
│   │   ├── services/
│   │   │   ├── api.ts            # API client
│   │   │   └── speechify.ts      # TTS client
│   │   ├── App.tsx               # Main app component
│   │   ├── main.tsx              # React entry point
│   │   ├── CONFIG.ts             # App configuration
│   │   └── index.css             # Global styles
│   ├── public/
│   │   ├── models/               # 3D character models (.glb)
│   │   └── animations/           # FBX animation files
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── package.json                  # Root package.json
├── .gitignore
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Chat
- `POST /api/chat/message` - Send message and get AI response
- `GET /api/chat/conversations` - Get all user conversations (paginated)
- `GET /api/chat/conversations/:id` - Get specific conversation with messages
- `DELETE /api/chat/conversations/:id` - Delete conversation
- `PUT /api/chat/conversations/:id` - Update conversation (title, settings)
- `POST /api/chat/conversations/:id/pin` - Toggle pin conversation
- `POST /api/chat/conversations/:id/archive` - Archive conversation
- `POST /api/chat/conversations/new` - Create new conversation
- `GET /api/chat/tts-token` - Get Speechify access token
- `GET /api/chat/voices` - Get available TTS voices

### Health
- `GET /health` - Server health check

## 🎨 Customization

### Adding Custom 3D Models
1. Export your Ready Player Me avatar as `.glb`
2. Place in `react/public/models/`
3. Update model path in `Avatar.tsx`

### Adding Custom Animations
1. Export animations as `.fbx` files
2. Place in `react/public/animations/`
3. Import and configure in `Avatar.tsx`

### Creating Custom Personalities
Edit `backend/src/services/geminiService.js`:
```javascript
const PERSONALITIES = {
  custom: `Your custom personality prompt here...`
};
```

### Styling Customization
- Global styles: `react/src/index.css`
- Component styles: Inline TailwindCSS classes
- Theme colors: `react/src/CONFIG.ts`

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Redis Connection Failed
Redis is optional. The app will continue without it, but caching won't work.
```bash
# Start Redis (optional)
redis-server
```

### Environment Variables Not Loading
- Ensure `.env` files exist in both `backend/` and `react/` directories
- Check for typos in variable names
- Restart development servers after changing `.env`

### 3D Model Not Loading
- Verify model file exists in `react/public/models/`
- Check browser console for loading errors
- Ensure model path in `Avatar.tsx` is correct

### Audio Not Playing
- Verify Speechify API key is valid
- Check browser console for errors
- Ensure browser allows audio playback

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or use the setup script
npm run setup
```

## 📝 Scripts

### Root Level
- `npm run setup` - Install all dependencies
- `npm run dev:backend` - Start backend dev server
- `npm run dev:frontend` - Start frontend dev server
- `npm run start:backend` - Start backend production server
- `npm run build:frontend` - Build frontend for production
- `npm run preview:frontend` - Preview production build

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security Notes

- Never commit `.env` files to version control
- Change `JWT_SECRET` in production
- Use strong passwords for user accounts
- Keep API keys secure
- Use HTTPS in production
- Implement rate limiting for production

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👏 Acknowledgments

- **Google Gemini AI** - Advanced language model
- **Speechify** - High-quality text-to-speech
- **Ready Player Me** - 3D avatar creation
- **Three.js & React Three Fiber** - 3D rendering
- **MongoDB** - Database solution
- **Redis** - Caching layer

## 📧 Contact

**Author:** DJ5harma

For questions or support, please open an issue on GitHub.

---

Made with 💜 by DJ5harma

**Star ⭐ this repo if you like it!**
