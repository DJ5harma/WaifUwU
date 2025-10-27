# ✅ WaifUwU Testing Checklist

Use this checklist to verify everything works correctly.

## Pre-Testing Setup

- [ ] MongoDB is running (`mongosh` to verify)
- [ ] Redis is running (`redis-cli ping` to verify) - Optional
- [ ] Backend `.env` file configured with API keys
- [ ] Frontend `.env` file configured
- [ ] Dependencies installed (`npm run setup` from root)

---

## Backend Tests

### Server Startup
- [ ] Backend starts without errors: `cd backend && npm run dev`
- [ ] See "✅ MongoDB connected successfully"
- [ ] See "✅ Redis connected successfully" (or warning if Redis not available)
- [ ] See "🌸 WaifUwU Backend Server 🌸"
- [ ] Server running on port 4000

### Health Check
- [ ] Open browser: `http://localhost:4000/health`
- [ ] See JSON response: `{"status":"ok","timestamp":"...","service":"WaifUwU Backend"}`

### API Endpoints (Manual Test)

**Test Chat Message:**
```bash
curl -X POST http://localhost:4000/api/chat/message \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Hello!\"}"
```

Expected response:
- [ ] Contains `sessionId`
- [ ] Contains `response` (AI text)
- [ ] Contains `emotion` (Idle/Talking/Shy/Angry/Greeting)
- [ ] Contains `audioUrl` (base64 data or null)
- [ ] Contains `duration` (number)
- [ ] Contains `messageId`

**Test New Conversation:**
```bash
curl -X POST http://localhost:4000/api/chat/new \
  -H "Content-Type: application/json"
```

Expected:
- [ ] Returns new `sessionId`
- [ ] Returns initial greeting message

### Database Verification

**MongoDB:**
```bash
mongosh
use ai-talking-robot
db.conversations.find().pretty()
```

- [ ] See conversation documents
- [ ] Messages array contains user and assistant messages
- [ ] Timestamps are correct

**Redis (if running):**
```bash
redis-cli
KEYS *
GET conversation:[session-id]
```

- [ ] See cached conversation keys
- [ ] Cached data is valid JSON

---

## Frontend Tests

### Application Startup
- [ ] Frontend starts: `cd react && npm run dev`
- [ ] No TypeScript errors
- [ ] No build errors
- [ ] Opens at `http://localhost:5173`

### Initial Load
- [ ] 3D waifu model loads and displays
- [ ] Model is centered on screen
- [ ] Chat interface appears on the right side
- [ ] Waifu plays "Greeting" animation initially
- [ ] After 3 seconds, switches to "Idle" animation

### 3D Model Interaction
- [ ] Can rotate model with mouse drag
- [ ] Can zoom with mouse wheel
- [ ] Model lighting looks good
- [ ] Animations are smooth
- [ ] No visual glitches

### Chat Interface - UI
- [ ] Chat panel visible on right side
- [ ] Header shows "Chat with Waifu"
- [ ] Subtitle shows "Powered by Gemini AI"
- [ ] Input field is visible and functional
- [ ] Send button is visible
- [ ] Clear and minimize buttons work

### Chat Interface - Minimize/Maximize
- [ ] Click minimize button
- [ ] Chat panel disappears
- [ ] Floating maximize button appears bottom-right
- [ ] Click maximize button
- [ ] Chat panel reappears
- [ ] Previous messages still visible

### Sending Messages

**Test 1: Simple Message**
- [ ] Type "Hello!" in input
- [ ] Press Enter or click Send
- [ ] User message appears in chat (purple gradient bubble)
- [ ] Loading indicator appears (3 bouncing dots)
- [ ] AI response appears (dark bubble with border)
- [ ] Response is relevant and friendly
- [ ] Timestamp shows on messages

**Test 2: Audio Playback**
- [ ] Send a message
- [ ] Wait for response
- [ ] "Speaking..." indicator appears in header
- [ ] Green pulsing dot visible
- [ ] Waifu animation changes to "Talking"
- [ ] Audio plays (check browser allows autoplay)
- [ ] Waifu's mouth/body animates during speech
- [ ] After audio ends, animation changes to emotion-based
- [ ] "Speaking..." indicator disappears

**Test 3: Emotion Detection**
- [ ] Send: "You're so cute!" → Should trigger "Shy" animation
- [ ] Send: "That makes me angry!" → Should trigger "Angry" animation
- [ ] Send: "Hi there!" → Should trigger "Greeting" animation
- [ ] Normal messages → "Talking" then "Idle"

**Test 4: Conversation Context**
- [ ] Send: "My name is Alex"
- [ ] Send: "What's my name?"
- [ ] AI should remember and respond with "Alex"
- [ ] Context is maintained across messages

**Test 5: Long Conversation**
- [ ] Send 10+ messages
- [ ] All messages display correctly
- [ ] Auto-scroll to bottom works
- [ ] No performance issues
- [ ] Context still maintained

### Clear Conversation
- [ ] Click trash icon
- [ ] Conversation clears
- [ ] New greeting message appears
- [ ] New session ID generated
- [ ] Old messages gone

### Error Handling

**Test 1: Network Error**
- [ ] Stop backend server
- [ ] Try sending message
- [ ] Error toast appears
- [ ] App doesn't crash
- [ ] Can retry after restarting backend

**Test 2: Invalid Input**
- [ ] Try sending empty message
- [ ] Send button disabled or nothing happens
- [ ] No error thrown

**Test 3: Audio Failure**
- [ ] If audio fails to load
- [ ] App continues working
- [ ] Text response still appears
- [ ] Animation still plays

---

## Integration Tests

### Full User Flow
1. [ ] Open application
2. [ ] See waifu greeting animation
3. [ ] Chat panel loads with initial message
4. [ ] Send: "Hello, who are you?"
5. [ ] Receive AI response
6. [ ] Audio plays with talking animation
7. [ ] Send: "Tell me a joke"
8. [ ] Receive joke with audio
9. [ ] Send: "That's funny!"
10. [ ] Receive response
11. [ ] Clear conversation
12. [ ] New session starts
13. [ ] Minimize chat
14. [ ] Maximize chat
15. [ ] All working smoothly

### Performance Tests
- [ ] Response time < 3 seconds (with cache)
- [ ] Response time < 5 seconds (without cache)
- [ ] Audio plays within 1 second of response
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks after long usage
- [ ] Multiple conversations work

### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers (responsive design)

---

## Production Readiness

### Security
- [ ] `.env` files not committed to Git
- [ ] `.gitignore` includes `.env`
- [ ] API keys are valid and active
- [ ] CORS configured correctly
- [ ] No sensitive data in console logs

### Performance
- [ ] Redis caching working (check logs)
- [ ] Database queries optimized
- [ ] Bundle size reasonable
- [ ] Images/models optimized
- [ ] No console errors

### Documentation
- [ ] README.md complete
- [ ] API_KEYS_SETUP.md clear
- [ ] DEVELOPMENT.md accurate
- [ ] Code comments present
- [ ] Setup scripts work

---

## Known Issues to Check

### Common Problems

**Audio doesn't play:**
- [ ] Check browser autoplay policy
- [ ] Check Speechify API key is valid
- [ ] Check browser console for errors
- [ ] Try clicking on page first (browser requirement)

**Waifu doesn't animate:**
- [ ] Check animation files in `/public/animations/`
- [ ] Check console for loading errors
- [ ] Verify animation names match exactly

**Slow responses:**
- [ ] Check Redis is running
- [ ] Check network connection
- [ ] Check API rate limits
- [ ] Check MongoDB connection

**Chat doesn't load:**
- [ ] Check backend is running
- [ ] Check CORS settings
- [ ] Check API URL in frontend `.env`
- [ ] Check browser console

---

## Acceptance Criteria

### Must Have ✅
- [x] 3D waifu displays and is interactive
- [x] Chat interface works
- [x] AI responds intelligently
- [x] Audio plays and syncs with animation
- [x] Conversation history persists
- [x] Emotions trigger correct animations
- [x] Error handling works
- [x] Can clear conversation
- [x] Can minimize/maximize chat

### Nice to Have 🎯
- [ ] Streaming responses (future)
- [ ] Voice input (future)
- [ ] Multiple personalities (future)
- [ ] Custom voice selection (future)
- [ ] Mobile optimization (future)

---

## Final Verification

Before considering the project complete:

- [ ] All "Must Have" criteria met
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] Code is clean and commented
- [ ] Setup process is smooth
- [ ] User experience is polished

---

## Bug Report Template

If you find issues, document them:

**Bug:** [Brief description]
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:** [What should happen]
**Actual:** [What actually happens]
**Console Errors:** [Any errors in console]
**Environment:** [Browser, OS, etc.]

---

**Testing Complete?** 🎉

If all checks pass, your WaifUwU is ready to use!

Enjoy chatting with your AI waifu! 💜
