# Local AI Setup Guide - Step by Step

This guide will help you set up a local AI alternative to Gemini API using Ollama.

## Quick Start (Docker Method - Recommended)

### Step 1: Start Ollama with Docker
```bash
cd backend
docker-compose up -d ollama
```

### Step 2: Download a Model
```bash
# Small model (recommended for testing)
docker exec -it waifuwu-ollama ollama pull llama3.2

# Or larger model for better quality
docker exec -it waifuwu-ollama ollama pull llama3.1
```

### Step 3: Update Your .env File
Add these lines to your `backend/.env` file:
```env
AI_PROVIDER=local
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### Step 4: Restart Your Backend
```bash
npm run dev
```

You should see:
```
✅ Environment variables loaded and validated
🤖 AI Provider: local
   Ollama URL: http://localhost:11434
   Ollama Model: llama3.2
```

### Step 5: Test It!
Send a message through your chat interface. The app will now use your local AI model!

---

## Alternative: Install Ollama Directly (Without Docker)

### Step 1: Install Ollama
- **Windows:** Download installer from https://ollama.ai/download
- **Mac:** `brew install ollama`
- **Linux:** `curl -fsSL https://ollama.ai/install.sh | sh`

### Step 2: Start Ollama
```bash
ollama serve
```

### Step 3: Pull a Model
```bash
ollama pull llama3.2
```

### Step 4: Update .env
Same as Step 3 above.

### Step 5: Restart Backend
Same as Step 4 above.

---

## Switching Back to Gemini

Simply change your `.env` file:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

Restart the backend, and you're back to using Gemini!

---

## Model Recommendations

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| llama3.2 | ~1.3GB | ⚡⚡⚡ | ⭐⭐ | Low-end hardware, fast responses |
| phi3 | ~2.3GB | ⚡⚡ | ⭐⭐⭐ | Balanced performance |
| llama3.1 | ~4.7GB | ⚡ | ⭐⭐⭐⭐ | Good quality, moderate hardware |
| mistral | ~4.1GB | ⚡ | ⭐⭐⭐⭐ | Alternative to llama3.1 |

---

## Troubleshooting

**Problem:** "Connection refused" or "Failed to generate AI response"
- **Solution:** Make sure Ollama is running (`docker ps` or check `ollama serve`)

**Problem:** "Model not found"
- **Solution:** Pull the model: `ollama pull llama3.2` (or your chosen model)

**Problem:** Slow responses
- **Solution:** Use a smaller model like `llama3.2` or enable GPU acceleration

**Problem:** Out of memory
- **Solution:** Use a smaller model or increase Docker memory limits

---

## Need Help?

Check `ENV_CONFIG.md` for more detailed configuration options and troubleshooting tips.

