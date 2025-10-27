# Environment Configuration

## Problem Fixed

Previously, environment variables were accessed via `process.env` throughout the codebase **before** `dotenv.config()` was called. This caused services instantiated at module load time to receive `undefined` values.

## Solution

Created a centralized environment configuration module (`src/config/env.js`) that:

1. **Loads environment variables FIRST** using `dotenv.config()`
2. **Validates required variables** on startup
3. **Exports a typed config object** for all modules to use

## Usage

Instead of:
```javascript
const apiKey = process.env.GEMINI_API_KEY;
```

Use:
```javascript
import { env } from '../config/env.js';
const apiKey = env.GEMINI_API_KEY;
```

## Benefits

- ✅ Environment variables loaded before any service initialization
- ✅ Validation on startup (fails fast if required vars missing)
- ✅ Single source of truth for all config
- ✅ Type-safe access to environment variables
- ✅ Default values defined in one place

## Files Updated

- `src/config/env.js` - New centralized config
- `src/index.js` - Removed dotenv.config(), uses env object
- `src/services/geminiService.js` - Uses env object
- `src/services/speechifyService.js` - Uses env object
- `src/config/database.js` - Uses env object
- `src/routes/authRoutes.js` - Uses env object
- `src/middleware/auth.js` - Uses env object
- `src/middleware/errorHandler.js` - Uses env object
