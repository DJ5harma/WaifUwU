# 🚀 Quick Start Guide

Get WaifUwU running in 5 minutes!

## Prerequisites

✅ Node.js installed  
✅ MongoDB installed and running  
✅ Redis installed and running (optional but recommended)  
✅ Google Gemini API key  
✅ Speechify API key  

---

## Step 1: Get API Keys (2 minutes)

### Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in and create API key
3. Copy the key

### Speechify API Key
1. Visit: https://speechify.com/api
2. Sign up and get API key
3. Copy the key

---

## Step 2: Setup (1 minute)

### Option A: Automated Setup (Recommended)
```bash
# Run setup script
setup.bat

# Edit backend/.env with your API keys
notepad backend\.env
```

### Option B: Manual Setup
```bash
# Install dependencies
cd backend
npm install
cd ../react
npm install

# Create .env files
cd ../backend
copy .env.example .env
cd ../react
copy .env.example .env
```

---

## Step 3: Configure API Keys (1 minute)

Edit `backend/.env`:

```env
GEMINI_API_KEY=your-gemini-key-here
SPEECHIFY_API_KEY=your-speechify-key-here
```

Keep other settings as default.

---

## Step 4: Start Services (30 seconds)

### Make sure these are running:

**MongoDB:**
```bash
# Should already be running, test with:
mongosh
```

**Redis (Optional):**
```bash
# Should already be running, test with:
redis-cli ping
# Should return: PONG
```

---

## Step 5: Launch Application (30 seconds)

### Option A: Automated Launch (Recommended)
```bash
# From project root
start.bat
```

### Option B: Manual Launch
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd react
npm run dev
```

---

## Step 6: Open and Enjoy! 🎉

1. Open browser: `http://localhost:5173`
2. See your cute 3D waifu
3. Chat interface on the right
4. Start chatting!

---

## First Conversation

Try these:

1. **"Hello!"** - She'll greet you
2. **"Tell me a joke"** - She'll respond with humor
3. **"You're so cute!"** - Watch her shy animation
4. **"What can you help me with?"** - Learn her capabilities

---

## Troubleshooting

### "Cannot connect to backend"
- Check backend is running on port 4000
- Check `VITE_API_URL` in `react/.env`

### "No audio playing"
- Check Speechify API key is valid
- Click on page first (browser autoplay policy)
- Check browser console for errors

### "MongoDB connection failed"
- Start MongoDB: `mongod`
- Check `MONGO_URI` in `backend/.env`

### "Waifu not animating"
- Check `/public/animations/` folder exists
- Check browser console for errors
- Refresh the page

---

## What's Next?

- Read [README.md](README.md) for full documentation
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for architecture
- See [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for testing
- Review [API_KEYS_SETUP.md](API_KEYS_SETUP.md) for detailed API setup

---

## Need Help?

1. Check browser console (F12)
2. Check backend terminal for errors
3. Review documentation files
4. Verify all prerequisites are met

---

**Enjoy your AI Waifu! 💜**

Made with love by DJ5harma
