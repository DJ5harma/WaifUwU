# Authentication System

## Overview

Complete authentication system with JWT tokens, guest sessions, and persistent login.

## Features

- ✅ **User Registration** - Create account with username, email, password
- ✅ **User Login** - Authenticate with email and password
- ✅ **Guest Sessions** - Try the app without registration (24h token)
- ✅ **Persistent Auth** - Token stored in localStorage, auto-login on refresh
- ✅ **Protected Routes** - Automatic JWT token attachment to API requests
- ✅ **User Profile** - Update display name, avatar, preferences
- ✅ **Subscription Tiers** - Free, Premium, Pro with different limits

## Usage

### Using the Auth Hook

```tsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isGuest, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return <div>Welcome, {user.username}!</div>;
}
```

### Auth Methods

```tsx
// Login
await login(email, password);

// Register
await register(username, email, password);

// Guest login
await loginAsGuest();

// Logout
logout();

// Update profile
await updateUser({ displayName: 'New Name' });
```

## Components

### AuthProvider
Wraps the entire app, provides auth context to all components.

### AuthModal
Login/Register modal with form validation and guest option.

### UserMenu
Top-left menu showing user info, settings, and logout button.

## API Types

All API methods are **fully typed** with no `any` or `unknown`:

- `User` - User profile data
- `AuthResponse` - Login/register response with token
- `UserResponse` - User data response
- `ConversationsResponse` - List of conversations
- `ConversationDetailResponse` - Single conversation with messages
- `Voice` - TTS voice data

## Token Flow

1. User logs in → Backend returns JWT token
2. Token saved to `localStorage.getItem('authToken')`
3. Axios interceptor automatically adds `Authorization: Bearer <token>` to all requests
4. Backend validates token on protected routes
5. On page refresh, AuthProvider loads user from token

## Security

- Passwords hashed with bcrypt on backend
- JWT tokens expire (7d for users, 24h for guests)
- Tokens stored in localStorage (consider httpOnly cookies for production)
- CORS configured for frontend URL
- Input validation on both frontend and backend
