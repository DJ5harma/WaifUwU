https://github.com/user-attachments/assets/7608965d-f700-49b8-94ff-6e018d22a374

# 🌸 WaifUwU - AI Waifu Chat Assistant

A stunning, interactive AI chat application featuring a 3D animated waifu character powered by Google Gemini AI and Speechify text-to-speech. Built with modern web technologies and designed to win frontend contests! ✨

![WaifUwU](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)

## 🎨 Features

### 🎭 Interactive 3D Character
- **Live2D Animated Waifu** - Fully animated character with multiple expressions
- **Emotion-Based Animations** - Character reacts with different animations (Idle, Talking, Shy, Angry, Greeting)
- **Smooth Transitions** - Seamless animation blending for natural movements

### 💬 Advanced Chat System
- **AI-Powered Conversations** - Powered by Google Gemini AI for intelligent responses
- **Real-time Messaging** - Instant message delivery and response
- **Conversation History** - Save and load previous conversations
- **Message Actions** - Listen to audio, copy messages, regenerate responses
- **Auto-load Last Chat** - Automatically loads your most recent conversation

### 🎵 Voice & Audio
- **7 Voice Options** - Choose from Kristy, Lisa, Emily, Erin, Lindsey, Monica, or Stacy
- **Text-to-Speech** - Powered by Speechify for natural-sounding voices
- **Floating Audio Player** - Beautiful player with progress bar, seek controls, and volume
- **On-Demand Audio** - Generate audio for any message with one click

### 🔐 Authentication & User Management
- **Secure Login/Register** - JWT-based authentication
- **User Profiles** - Display name, email, and avatar support
- **Session Management** - Persistent login across sessions
- **User Menu** - Quick access to logout and profile info

### 🎨 Stunning UI/UX
- **Contest-Winning Design** - Modern, beautiful interface designed to impress
- **Glassmorphism Effects** - Frosted glass aesthetic throughout
- **Animated Background** - Floating orbs, particles, and gradient shifts
- **Smooth Animations** - 60fps animations for all interactions
- **Glow Effects** - Pulsing neon-style glows on key elements
- **Responsive Design** - Works beautifully on all screen sizes

### 📱 Conversation Management
- **Sidebar Navigation** - Easy access to all conversations
- **Smart Titles** - Conversations named after first message
- **Delete Conversations** - Remove unwanted chats
- **Conversation Count** - See total number of saved chats
- **Collapsible Sidebar** - More screen space when needed

### ✨ Additional Features
- **Minimizable Chat** - Reduce chat to floating button
- **Toast Notifications** - Beautiful feedback for all actions
- **Loading States** - Animated loading indicators
- **Error Handling** - Graceful error messages
- **Keyboard Shortcuts** - Enter to send messages

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern React with hooks
- **TypeScript 5.6** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Toastify** - Toast notifications
- **React Icons** - Beautiful icon library
- **Pixi.js** - 2D rendering for Live2D
- **Live2D Cubism SDK** - Character animation

### Backend
- **Node.js 20+** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Google Gemini AI** - AI conversation engine
- **Speechify API** - Text-to-speech generation

## 📦 Installation

### Prerequisites
- Node.js 20 or higher
- MongoDB installed and running
- Google Gemini API key
- Speechify API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/WaifUwU.git
cd WaifUwU
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/waifuwu
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
SPEECHIFY_API_KEY=your_speechify_api_key_here
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../react
npm install
```

Create a `.env` file in the `react` directory:
```env
VITE_API_URL=http://localhost:4000
VITE_SPEECHIFY_API_KEY=your_speechify_api_key_here
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

## 🚀 Usage

### First Time Setup
1. **Register an Account** - Click "Register" on the auth modal
2. **Login** - Use your credentials to log in
3. **Start Chatting** - Type a message and press Enter or click Send
4. **Select Voice** - Click the voice selector to choose your preferred voice
5. **Enjoy!** - Watch your waifu come to life!

### Features Guide

#### Sending Messages
- Type your message in the input box
- Press `Enter` or click the send button
- The AI will respond with text and audio

#### Voice Selection
- Click the voice button in the header (🎵)
- Choose from 7 different voices
- Selected voice applies to all new messages

#### Message Actions
- **🔊 Listen** - Play audio for any message
- **📋 Copy** - Copy message text to clipboard
- **🔄 Regenerate** - Get a new response

#### Conversation Management
- **New Chat** - Click "New Chat" in sidebar
- **Load Chat** - Click any conversation to load it
- **Delete Chat** - Hover over conversation and click trash icon
- **Hide Sidebar** - Click "Hide sidebar" at bottom

#### Audio Player
- **Play/Pause** - Control audio playback
- **Seek** - Click progress bar to jump to position
- **Volume** - Adjust volume with slider
- **Close** - Close the audio player

## 📁 Project Structure

```
WaifUwU/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── server.js        # Entry point
│   ├── public/              # Static files
│   └── package.json
├── react/
│   ├── src/
│   │   ├── Components/      # React components
│   │   ├── Providers/       # Context providers
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── App.tsx          # Main app component
│   │   └── index.css        # Global styles
│   ├── public/              # Public assets
│   └── package.json
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Chat
- `POST /api/chat` - Send message and get response
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/conversation/:id` - Get specific conversation
- `DELETE /api/chat/conversation/:id` - Delete conversation

## 🎨 Customization

### Changing Waifu Model
Replace the Live2D model files in `react/public/live2d/` with your own model.

### Modifying Animations
Edit animation states in `react/src/Components/Waifu.tsx`.

### Styling
All styles use TailwindCSS. Modify `react/src/index.css` for global styles.

### Adding More Voices
Add voice options to the `availableVoices` array in `ChatInterface.tsx`.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### API Key Errors
- Verify Gemini API key is valid
- Verify Speechify API key is valid
- Check `.env` files are properly configured

### Audio Not Playing
- Check browser console for errors
- Verify Speechify API key
- Ensure audio URLs are accessible

### Build Errors
- Delete `node_modules` and reinstall: `npm install`
- Clear build cache: `npm run clean` (if available)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👏 Acknowledgments

- **Google Gemini AI** - For powering the intelligent conversations
- **Speechify** - For natural text-to-speech
- **Live2D** - For the amazing character animation system
- **React Community** - For the incredible ecosystem
- **TailwindCSS** - For making styling a breeze

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with 💜 by [Your Name]

**Star ⭐ this repo if you like it!**
