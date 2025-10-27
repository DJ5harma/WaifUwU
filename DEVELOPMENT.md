# 🛠️ WaifUwU Development Guide

## Architecture Overview

### System Flow

```
User Input → Frontend (React) → Backend API → Gemini AI
                ↓                    ↓
            3D Waifu ← Audio ← Speechify TTS
                ↓
         Talking Animation
```

### Data Flow

1. **User sends message** → ChatInterface component
2. **API call** → Backend `/api/chat/message`
3. **Check Redis cache** → If cached, return immediately
4. **Query MongoDB** → Get conversation history
5. **Call Gemini AI** → Generate response with context
6. **Emotion detection** → Determine animation type
7. **Call Speechify** → Generate audio from response
8. **Cache response** → Store in Redis
9. **Save to MongoDB** → Persist conversation
10. **Return to frontend** → Response + audio + emotion
11. **Play audio** → Trigger Talking animation
12. **Audio ends** → Switch to emotion-based animation

## Backend Architecture

### Services Layer

#### GeminiService (`services/geminiService.js`)
- Manages Google Generative AI client
- Handles conversation context
- Detects emotions from responses
- Supports streaming (future enhancement)

**Key Methods:**
- `generateResponse(history, message)` - Main chat function
- `detectEmotion(text)` - Emotion analysis for animations
- `generateStreamingResponse()` - For real-time streaming

#### SpeechifyService (`services/speechifyService.js`)
- Text-to-speech conversion
- Returns base64 encoded audio
- Estimates audio duration

**Key Methods:**
- `textToSpeech(text)` - Convert text to MP3
- `getVoices()` - List available voices

#### CacheService (`services/cacheService.js`)
- Redis integration
- Conversation context caching
- Response caching for duplicate queries

**Key Methods:**
- `getConversationContext(sessionId)`
- `setConversationContext(sessionId, messages)`
- `cacheResponse(key, value)`
- `getCachedResponse(key)`

### Database Models

#### Conversation Model
```javascript
{
  sessionId: String (unique),
  userId: String,
  messages: [{
    role: 'user' | 'assistant' | 'system',
    content: String,
    timestamp: Date,
    audioUrl: String
  }],
  metadata: {
    totalMessages: Number,
    lastActive: Date,
    waifuPersonality: String
  }
}
```

### API Routes

#### POST `/api/chat/message`
**Request:**
```json
{
  "message": "Hello!",
  "sessionId": "uuid-here" // optional
}
```

**Response:**
```json
{
  "sessionId": "uuid-here",
  "response": "Hi there! How can I help?",
  "emotion": "Greeting",
  "audioUrl": "data:audio/mp3;base64,...",
  "duration": 2500,
  "messageId": "message-id"
}
```

## Frontend Architecture

### Component Hierarchy

```
App
├── WaifuProvider (State Management)
│   ├── Waifu (3D Scene)
│   │   └── Avatar (3D Model + Animations)
│   └── ChatInterface (Chat UI)
```

### State Management

#### WaifuProvider Context
```typescript
{
  currentAnimation: 'Idle' | 'Talking' | 'Shy' | 'Angry' | 'Greeting',
  setCurrentAnimation: (animation) => void
}
```

**Animation Flow:**
1. Initial: `Greeting` (3 seconds)
2. Default: `Idle`
3. During speech: `Talking`
4. After speech: Emotion-based (`Shy`, `Angry`, `Greeting`, or `Idle`)

### ChatInterface Component

**State:**
- `messages` - Chat history
- `inputMessage` - Current input
- `sessionId` - Conversation ID
- `isLoading` - Loading state
- `isMinimized` - UI state
- `currentAudio` - Audio player reference

**Key Functions:**
- `initializeConversation()` - Start new session
- `sendMessage()` - Send user message
- `playAudio()` - Play TTS + sync animation
- `clearChat()` - Reset conversation

### Audio Synchronization

```typescript
const playAudio = async (audioUrl, emotion, duration) => {
  // 1. Stop any current audio
  currentAudio?.pause();
  
  // 2. Create new audio element
  const audio = new Audio(audioUrl);
  
  // 3. Set to Talking animation
  setCurrentAnimation('Talking');
  
  // 4. Play audio
  await audio.play();
  
  // 5. On end, switch to emotion animation
  audio.onended = () => {
    setCurrentAnimation(emotion);
  };
  
  // 6. Fallback timeout
  setTimeout(() => {
    if (!audio.paused) {
      audio.pause();
      setCurrentAnimation(emotion);
    }
  }, duration + 1000);
};
```

## Optimization Strategies

### 1. Redis Caching
- **Conversation Context**: Last 20 messages cached (1 hour TTL)
- **Response Cache**: Identical queries cached (30 min TTL)
- **Cache Key**: MD5 hash of lowercase trimmed message

### 2. Database Optimization
- **Index**: `sessionId` for fast lookups
- **TTL**: Auto-delete conversations after 30 days
- **Limit**: Keep only last 10 messages in context for AI

### 3. Frontend Performance
- **Lazy Loading**: 3D model loaded in Suspense
- **Memoization**: 3D scene cloned with useMemo
- **Debouncing**: Could add input debouncing (future)

### 4. Audio Optimization
- **Base64 Encoding**: Inline audio (no file storage needed)
- **Duration Estimation**: Avoid waiting for full audio load
- **Fallback**: Continue without audio if TTS fails

## Error Handling

### Backend
```javascript
try {
  // Operation
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'User-friendly message',
    details: error.message 
  });
}
```

### Frontend
```typescript
try {
  // API call
} catch (error) {
  console.error('Error:', error);
  toast.error('User-friendly message');
  setCurrentAnimation('Idle'); // Reset state
}
```

## Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/ai-talking-robot
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-key
SPEECHIFY_API_KEY=your-speechify-key
REDIS_URL=redis://localhost:6379
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
```

## Testing Strategy

### Manual Testing Checklist

**Backend:**
- [ ] MongoDB connection successful
- [ ] Redis connection successful (optional)
- [ ] Gemini API responding
- [ ] Speechify API generating audio
- [ ] Conversation persistence working
- [ ] Cache hit/miss working

**Frontend:**
- [ ] 3D model loads correctly
- [ ] Initial greeting animation plays
- [ ] Chat interface appears
- [ ] Messages send successfully
- [ ] Audio plays and syncs with animation
- [ ] Animations transition smoothly
- [ ] Clear conversation works
- [ ] Minimize/maximize works

**Integration:**
- [ ] Full conversation flow works
- [ ] Audio-animation sync is smooth
- [ ] Error states handled gracefully
- [ ] Multiple conversations work
- [ ] Cache improves response time

## Common Issues & Solutions

### Issue: Audio doesn't play
**Solution:**
- Check browser console for errors
- Verify Speechify API key is valid
- Check if browser blocks autoplay
- Ensure audio format is supported

### Issue: Animation doesn't sync
**Solution:**
- Check `playAudio` function timing
- Verify emotion detection is working
- Check animation names match exactly
- Look for console errors

### Issue: Slow responses
**Solution:**
- Check Redis is running and connected
- Verify cache is being used (check logs)
- Reduce conversation history size
- Check network latency to APIs

### Issue: MongoDB connection fails
**Solution:**
- Verify MongoDB is running: `mongosh`
- Check MONGO_URI in .env
- Ensure database name is correct
- Check firewall settings

## Future Enhancements

### Planned Features
1. **Streaming Responses**: Real-time text generation
2. **Voice Input**: Speech-to-text for user messages
3. **Multiple Personalities**: Switchable waifu personalities
4. **Custom Voices**: User-selectable TTS voices
5. **Conversation Export**: Download chat history
6. **Multi-language**: Support for other languages
7. **Mobile Responsive**: Better mobile UI
8. **WebSocket**: Real-time updates
9. **User Authentication**: Personal conversations
10. **Cloud Storage**: Save audio files to S3/Cloud

### Code Improvements
- Add unit tests (Jest)
- Add E2E tests (Playwright)
- Implement proper TypeScript types everywhere
- Add API rate limiting
- Implement request validation (Zod)
- Add monitoring (Sentry)
- Add analytics
- Improve error messages
- Add loading skeletons
- Optimize bundle size

## Development Workflow

### Adding New Animation
1. Add animation FBX file to `/public/animations/`
2. Update `WAIFU_ANIMATION_TYPE` in `WaifuProvider.tsx`
3. Load animation in `Avatar.tsx` using `useFBX`
4. Add to animations array in `useAnimations`
5. Update emotion detection in `geminiService.js`

### Adding New API Endpoint
1. Create route handler in `routes/chatRoutes.js`
2. Add service function if needed
3. Update API client in `react/src/services/api.ts`
4. Add TypeScript types
5. Use in components

### Modifying Waifu Personality
1. Edit `WAIFU_SYSTEM_PROMPT` in `geminiService.js`
2. Test with various inputs
3. Adjust emotion detection if needed
4. Update documentation

## Performance Benchmarks

**Target Metrics:**
- API Response Time: < 2 seconds
- Audio Generation: < 1 second
- Animation Transition: < 0.5 seconds
- 3D Model Load: < 3 seconds
- Cache Hit Rate: > 30%

## Security Considerations

1. **API Keys**: Never commit .env files
2. **CORS**: Restrict to frontend domain in production
3. **Rate Limiting**: Add to prevent abuse
4. **Input Validation**: Sanitize user messages
5. **MongoDB Injection**: Use Mongoose properly
6. **XSS Protection**: React handles this by default
7. **HTTPS**: Use in production
8. **Environment Separation**: Different keys for dev/prod

---

Happy coding! 💜
