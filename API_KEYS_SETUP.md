# 🔑 API Keys Setup Guide

This guide will help you obtain and configure the required API keys for WaifUwU.

## Required API Keys

1. **Google Gemini API Key** - For AI chat responses
2. **Speechify API Key** - For text-to-speech voice synthesis

---

## 1. Google Gemini API Key

### Step 1: Get the API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the generated API key

### Step 2: Configure in Backend

Open `backend/.env` and add:

```env
GEMINI_API_KEY=AIzaSy...your-actual-key-here
```

### Features Used
- Model: `gemini-1.5-flash`
- Features: Text generation, conversation context
- Free Tier: 60 requests per minute

### Troubleshooting
- **Error: API key not valid**: Ensure you copied the full key
- **Error: Quota exceeded**: Wait or upgrade to paid tier
- **Error: Model not found**: Check model name is `gemini-1.5-flash`

---

## 2. Speechify API Key

### Step 1: Get the API Key

1. Go to [Speechify API](https://speechify.com/api)
2. Sign up for an account
3. Navigate to **API Keys** section in dashboard
4. Click **"Create New API Key"**
5. Copy the generated API key

### Step 2: Configure in Backend

Open `backend/.env` and add:

```env
SPEECHIFY_API_KEY=sk_...your-actual-key-here
```

### Features Used
- Model: `simba-turbo`
- Format: MP3
- Voice: Default (can be customized)

### Voice Customization

To change the voice, edit `backend/src/services/speechifyService.js`:

```javascript
const response = await this.client.textToSpeech({
  input: text,
  voiceId: 'your-preferred-voice-id', // Change this
  audioFormat: 'mp3',
  model: 'simba-turbo'
});
```

**Popular Voice IDs:**
- `mrbeast` - Default male voice
- `snoop` - Snoop Dogg style
- `gwyneth` - Female voice
- Check Speechify docs for full list

### Troubleshooting
- **Error: Invalid API key**: Verify key format starts with `sk_`
- **Error: Voice not found**: Use valid voice ID from Speechify
- **Audio doesn't play**: Check browser console, may need HTTPS

---

## 3. MongoDB Setup

### Local MongoDB

**Windows:**
1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will run on `mongodb://localhost:27017`

**Using MongoDB Atlas (Cloud - Free):**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a free cluster
4. Get connection string
5. Update `backend/.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-talking-robot
```

---

## 4. Redis Setup (Optional but Recommended)

### Local Redis

**Windows:**
1. Download [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
2. Extract and run `redis-server.exe`
3. Redis will run on `redis://localhost:6379`

**Using Redis Cloud (Free):**
1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Create free account
3. Create free database
4. Get connection URL
5. Update `backend/.env`:

```env
REDIS_URL=redis://username:password@host:port
```

**Note:** App works without Redis, but responses will be slower

---

## Complete .env Example

### Backend `.env`

```env
# Database
MONGO_URI=mongodb://localhost:27017/ai-talking-robot

# Security
JWT_SECRET=change-this-to-random-string-12345

# AI APIs
GEMINI_API_KEY=AIzaSyABCDEF1234567890_your_actual_key
SPEECHIFY_API_KEY=sk_1234567890abcdef_your_actual_key

# Cache (Optional)
REDIS_URL=redis://localhost:6379

# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:4000
```

---

## Verification

### Test Backend Connection

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Redis connected successfully
🌸 WaifUwU Backend Server 🌸
Status: ✅ Running
Port: 4000
```

### Test API Keys

**Test Gemini:**
```bash
curl -X POST http://localhost:4000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!"}'
```

Should return JSON with AI response.

**Test Speechify:**
Check the response includes `audioUrl` field.

---

## Security Best Practices

### ✅ DO:
- Keep API keys in `.env` files
- Add `.env` to `.gitignore`
- Use different keys for development and production
- Rotate keys periodically
- Set up billing alerts

### ❌ DON'T:
- Commit `.env` files to Git
- Share API keys publicly
- Use production keys in development
- Hardcode keys in source code
- Expose keys in client-side code

---

## Cost Estimates

### Free Tier Limits

**Google Gemini:**
- 60 requests per minute
- Free tier available
- Sufficient for development and small projects

**Speechify:**
- Check current pricing at [speechify.com/api](https://speechify.com/api)
- Free tier may be available
- Pay-as-you-go pricing

**MongoDB Atlas:**
- 512 MB storage free
- Shared cluster
- Perfect for development

**Redis Cloud:**
- 30 MB storage free
- Sufficient for caching

### Production Recommendations
- Monitor API usage
- Set up billing alerts
- Consider caching to reduce API calls
- Implement rate limiting

---

## Troubleshooting

### "API key not found" Error
1. Check `.env` file exists in `backend/` folder
2. Verify no typos in variable names
3. Restart backend server after changing `.env`
4. Check file is not named `.env.txt` or `.env.example`

### "Connection refused" Error
1. Ensure MongoDB is running: `mongosh`
2. Ensure Redis is running: `redis-cli ping`
3. Check ports are not blocked by firewall
4. Verify connection strings in `.env`

### "Invalid API key" Error
1. Copy the full key without spaces
2. Check key hasn't expired
3. Verify account has active subscription
4. Try regenerating the key

---

## Support

If you encounter issues:

1. Check the [README.md](README.md) for setup instructions
2. Review [DEVELOPMENT.md](DEVELOPMENT.md) for architecture details
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify all dependencies are installed: `npm install`

---

**Ready to go?** Run `setup.bat` to automatically configure everything! 🚀
