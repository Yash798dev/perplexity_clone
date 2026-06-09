# 🌠 Comet — Perplexity AI Clone

A full-stack, pixel-perfect clone of **Perplexity AI**, built with **Angular 21** on the frontend and **Node.js / Express** on the backend. Comet features real user authentication (email/password + Google OAuth), persistent chat sessions, an AI-powered Q&A engine, and a rich multi-page UI covering Search, Discover, Finance, Health, Academic, Patents, Spaces, and more.

> **Live Demo**
> - 🌐 Frontend: [https://perplexity-clone-xvkc.onrender.com](https://perplexity-clone-xvkc.onrender.com)
> - ⚙️ Backend API: [https://perplexity-clone-backend-xvkc.onrender.com](https://perplexity-clone-backend-xvkc.onrender.com)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Folder Structure](#-folder-structure)
4. [Prerequisites](#-prerequisites)
5. [Local Setup — Step by Step](#-local-setup--step-by-step)
   - [1. Clone the Repository](#1-clone-the-repository)
   - [2. Backend Setup](#2-backend-setup)
   - [3. Frontend Setup](#3-frontend-setup)
   - [4. Run the App](#4-run-the-app)
6. [Environment Variables](#-environment-variables)
7. [Application Routes (Pages)](#-application-routes-pages)
8. [Backend API Reference](#-backend-api-reference)
   - [Auth Endpoints](#auth-endpoints)
   - [User Endpoints](#user-endpoints)
   - [Chat Endpoints](#chat-endpoints)
9. [Database Architecture](#-database-architecture)
10. [Authentication Flow](#-authentication-flow)
11. [How the Chat / Q&A Engine Works](#-how-the-chat--qa-engine-works)
12. [Deployment Guide](#-deployment-guide)
13. [Testing the Output](#-testing-the-output)
14. [Troubleshooting](#-troubleshooting)
15. [Screenshots](#-screenshots)

---

## 🚀 Project Overview

Comet is a functional clone of Perplexity.ai with:

- **User Authentication** — Signup, Login, Google Sign-In, JWT-secured sessions
- **Onboarding Flow** — New users are walked through a profile setup before reaching the main app
- **Chat Sessions** — Create, browse, continue, and delete multi-turn AI conversations
- **AI Q&A Engine** — A built-in keyword-driven answer engine responds to user queries
- **Discovery Pages** — Dedicated views for Finance, Health, Academic research, and Patents
- **Profile Management** — Users can update their name, phone number, bio, and avatar URL
- **Route Guards** — All protected pages require authentication and completed onboarding
- **JSON File Database** — A lightweight, dependency-free mock database powered by JSON files and a custom SQL-to-JS parser (no SQLite binary required)

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Angular | 21.x | Core SPA framework |
| TypeScript | 5.9.x | Type safety |
| SCSS | — | Component styling |
| RxJS | 7.8.x | Reactive state & HTTP |
| Angular Router | 21.x | Lazy-loaded page routing |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥ 18 | Runtime |
| Express.js | 4.x | HTTP server & routing |
| bcryptjs | 2.x | Password hashing |
| jsonwebtoken | 9.x | JWT auth tokens |
| google-auth-library | 9.x | Google OAuth token verification |
| uuid | 9.x | Unique ID generation |
| dotenv | 16.x | Environment variable loading |
| nodemon | 3.x | Dev auto-reload |

### Database
- **JSON flat files** (no external DB engine needed)
- Custom in-memory SQL query parser maps SQLite-style `prepare().get/all/run()` calls to plain JS array operations on JSON files

---

## 📁 Folder Structure

```
comet_clone/
├── src/                          # Angular frontend source
│   ├── app/
│   │   ├── components/           # All page components
│   │   │   ├── home/             # Landing / search page
│   │   │   ├── chat/             # Chat conversation view
│   │   │   ├── search-results/   # Search results page
│   │   │   ├── discover/         # Discover feed
│   │   │   ├── finance/          # Finance news/data
│   │   │   ├── health/           # Health information
│   │   │   ├── academic/         # Academic research
│   │   │   ├── patents/          # Patent search
│   │   │   ├── spaces/           # Spaces feature
│   │   │   ├── artifacts/        # Saved artifacts
│   │   │   ├── history/          # Chat history
│   │   │   ├── profile/          # User profile settings
│   │   │   ├── login/            # Login page
│   │   │   ├── signup/           # Signup page
│   │   │   ├── onboarding/       # New user onboarding
│   │   │   ├── sidebar/          # Global navigation sidebar
│   │   │   ├── mindmap/          # Mind map view
│   │   │   └── quiz/             # Quiz feature
│   │   ├── config/
│   │   │   └── api.config.ts     # API base URL (dev vs prod)
│   │   ├── guards/
│   │   │   ├── auth.guard.ts     # Requires login
│   │   │   └── onboarding.guard.ts # Requires completed onboarding
│   │   ├── interceptors/         # HTTP interceptors (auth token injection)
│   │   ├── services/
│   │   │   ├── auth.service.ts   # Login, signup, Google auth, token storage
│   │   │   └── chat-api.service.ts # Chat session & message API calls
│   │   ├── app.routes.ts         # All application routes
│   │   └── app.config.ts         # Angular app bootstrapping
│   ├── index.html                # HTML shell
│   └── styles.scss               # Global styles
│
├── backend/                      # Express.js backend
│   ├── controllers/
│   │   ├── auth.controller.js    # Signup, login, Google sign-in, /me
│   │   ├── chat.controller.js    # Chat sessions & messages CRUD
│   │   └── user.controller.js    # Profile read/update, onboarding
│   ├── database/
│   │   ├── db.js                 # JSON-based mock database engine
│   │   └── data/                 # JSON data files (auto-created)
│   │       ├── users.json
│   │       ├── profiles.json
│   │       ├── chat_sessions.json
│   │       └── messages.json
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification middleware
│   │   └── error.middleware.js   # Global error handler
│   ├── routes/
│   │   ├── auth.routes.js        # /api/auth/*
│   │   ├── user.routes.js        # /api/user/*
│   │   └── chat.routes.js        # /api/chats/*
│   ├── utils/
│   │   ├── jwt.utils.js          # Token sign & verify helpers
│   │   └── qa-engine.js          # Keyword-based AI answer engine
│   ├── server.js                 # Express entry point
│   ├── package.json
│   └── .env                      # Backend environment variables
│
├── package.json                  # Frontend dependencies
├── angular.json                  # Angular CLI config
├── tsconfig.json                 # TypeScript config
└── README.md
```

---

## ✅ Prerequisites

Make sure you have the following installed before starting:

| Tool | Minimum Version | Check Command |
|---|---|---|
| Node.js | 18.x or higher | `node -v` |
| npm | 9.x or higher | `npm -v` |
| Angular CLI | 21.x | `ng version` |
| Git | Any recent | `git --version` |

> **Install Angular CLI globally** (if not already):
> ```bash
> npm install -g @angular/cli@21
> ```

---

## ⚙️ Local Setup — Step by Step

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/comet_clone.git
cd comet_clone
```

---

### 2. Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Install all backend dependencies
npm install

# Create your environment file
# (copy the template below — see the Environment Variables section)
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

> The `database/data/` directory and all JSON files are **auto-created** on first server start — no manual DB setup required.

---

### 3. Frontend Setup

```bash
# From the project root
cd ..         # make sure you are in comet_clone/
npm install
```

> The frontend API URL is controlled by `src/app/config/api.config.ts`:
> - In **development** (`ng serve`): automatically points to `http://localhost:3000`
> - In **production** (deployed build): automatically points to the Render backend URL

---

### 4. Run the App

You need **two terminals** running simultaneously.

**Terminal 1 — Start the Backend:**
```bash
cd backend
npm run dev      # uses nodemon for hot-reload
# OR for production-style run:
npm start
```

Expected output:
```
Server is running on port 3000
```

**Terminal 2 — Start the Frontend:**
```bash
# from project root (comet_clone/)
npm start        # runs: ng serve
# OR
ng serve
```

Expected output:
```
✔ Browser application bundle generation complete.
Initial chunk files | Names         | Raw size
...
Application bundle generation complete.

Watch mode enabled. Watching for file changes...
  ➜  Local:   http://localhost:4200/
```

**Open your browser at:**

```
http://localhost:4200
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Optional | Port the server listens on. Defaults to `3000` |
| `JWT_SECRET` | **Required** | Secret key used to sign and verify JWT tokens. Use a long random string |
| `GOOGLE_CLIENT_ID` | Required for Google Sign-In | OAuth 2.0 Client ID from Google Cloud Console |

**Example `.env`:**
```env
PORT=3000
JWT_SECRET=mySuperSecretKey_changeThis_inProduction_!@#456
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🗺 Application Routes (Pages)

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Email/password and Google login |
| `/signup` | Public | New account registration |
| `/onboarding` | Auth required | First-time profile setup (name, phone) |
| `/` | Auth + Onboarded | Home — main search interface |
| `/search?q=...` | Auth + Onboarded | AI search results for a query |
| `/chat` | Auth + Onboarded | New blank chat session |
| `/chat/:id` | Auth + Onboarded | Continue a specific chat session |
| `/discover` | Auth + Onboarded | Discover trending topics |
| `/finance` | Auth + Onboarded | Finance news and data |
| `/health` | Auth + Onboarded | Health information hub |
| `/academic` | Auth + Onboarded | Academic research results |
| `/patents` | Auth + Onboarded | Patent search interface |
| `/spaces` | Auth + Onboarded | Collaborative spaces |
| `/artifacts` | Auth + Onboarded | Saved artifacts |
| `/history` | Auth + Onboarded | Full chat history |
| `/profile` | Auth + Onboarded | User profile & settings |

**Route Guards:**
- `authGuard` — Redirects to `/login` if no valid JWT is present
- `onboardingGuard` — Redirects to `/onboarding` if `isOnboarded === false`

---

## 📡 Backend API Reference

**Base URL (local):** `http://localhost:3000`

All protected endpoints require an `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Endpoints

#### `POST /api/auth/signup`
Register a new user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response `201`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-v4-string",
    "email": "user@example.com",
    "isOnboarded": false,
    "fullName": "",
    "phoneNumber": "",
    "avatarUrl": "",
    "bio": ""
  }
}
```

**Error Responses:**
| Status | Condition |
|---|---|
| `400` | Missing email or password, or password < 6 characters |
| `409` | Email already registered |

---

#### `POST /api/auth/login`
Log in with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-v4-string",
    "email": "user@example.com",
    "isOnboarded": true,
    "fullName": "John Doe",
    "phoneNumber": "+1234567890",
    "avatarUrl": "",
    "bio": "Researcher"
  }
}
```

**Error Responses:**
| Status | Condition |
|---|---|
| `400` | Missing email or password |
| `401` | Invalid credentials |

---

#### `POST /api/auth/google`
Authenticate via Google OAuth (pass the Google ID token from the frontend).

**Request Body:**
```json
{
  "idToken": "google-id-token-from-client"
}
```

**Success Response `200`:**
```json
{
  "token": "jwt-token",
  "user": { ... },
  "isNew": true
}
```

> `isNew: true` means this is a first-time Google sign-in (frontend uses this to redirect to onboarding).

---

#### `GET /api/auth/me` 🔒
Returns the currently authenticated user's profile.

**Response `200`:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "isOnboarded": true,
    "fullName": "John Doe",
    "phoneNumber": "",
    "avatarUrl": "",
    "bio": ""
  }
}
```

---

### User Endpoints

#### `GET /api/user/profile` 🔒
Get the authenticated user's profile.

#### `PUT /api/user/profile` 🔒
Update profile details.

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "phoneNumber": "+9876543210",
  "avatarUrl": "https://example.com/avatar.png",
  "bio": "Software Engineer"
}
```

#### `POST /api/user/onboarding` 🔒
Mark user onboarding as complete.

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "phoneNumber": "+9876543210"
}
```

---

### Chat Endpoints

#### `GET /api/chats` 🔒
List all chat sessions for the authenticated user.

**Response `200`:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "title": "What is quantum computing?",
      "created_at": "2024-06-09T10:00:00.000Z",
      "updated_at": "2024-06-09T11:30:00.000Z"
    }
  ]
}
```

---

#### `POST /api/chats` 🔒
Create a new chat session.

**Request Body:**
```json
{
  "title": "My Research Chat"
}
```

**Response `201`:**
```json
{
  "session": {
    "id": "uuid",
    "user_id": "user-uuid",
    "title": "My Research Chat",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

#### `DELETE /api/chats/:id` 🔒
Delete a chat session and all its messages.

**Response `200`:**
```json
{ "success": true }
```

---

#### `GET /api/chats/:id/messages` 🔒
Retrieve all messages in a chat session (ordered oldest → newest).

**Response `200`:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "What is machine learning?",
      "created_at": "..."
    },
    {
      "id": "uuid",
      "role": "bot",
      "content": "Machine learning is a branch of AI...",
      "created_at": "..."
    }
  ]
}
```

---

#### `POST /api/chats/:id/messages` 🔒
Send a user message and receive a bot response.

**Request Body:**
```json
{
  "content": "Explain neural networks"
}
```

**Response `200`:**
```json
{
  "userMessage": {
    "id": "uuid",
    "role": "user",
    "content": "Explain neural networks",
    "created_at": "..."
  },
  "botMessage": {
    "id": "uuid",
    "role": "bot",
    "content": "Neural networks are computing systems...",
    "created_at": "..."
  },
  "session": {
    "id": "uuid",
    "title": "Explain neural networks",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

> The session `title` is automatically set from the **first message** the user sends.

---

#### `GET /health`
Health check — no authentication required.

**Response `200`:**
```json
{
  "status": "healthy",
  "timestamp": "2024-06-09T10:00:00.000Z"
}
```

---

## 🗄 Database Architecture

The project uses a **zero-dependency JSON flat-file database** — no PostgreSQL, no SQLite binary, no external service needed.

### Tables (JSON files in `backend/database/data/`)

| File | Description |
|---|---|
| `users.json` | Registered users with email, password hash, Google ID, onboarding status |
| `profiles.json` | Extended profile data (name, phone, avatar, bio) linked to user |
| `chat_sessions.json` | Chat sessions with title and timestamps |
| `messages.json` | All messages (user and bot) linked to sessions |

### Schema

**users**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "password_hash": "$2a$12$...",
  "google_id": null,
  "is_onboarded": 0,
  "created_at": "ISO timestamp"
}
```

**profiles**
```json
{
  "user_id": "uuid",
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "avatar_url": "",
  "bio": "",
  "updated_at": "ISO timestamp"
}
```

**chat_sessions**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "What is AI?",
  "created_at": "ISO timestamp",
  "updated_at": "ISO timestamp"
}
```

**messages**
```json
{
  "id": "uuid",
  "session_id": "uuid",
  "role": "user | bot",
  "content": "Message text",
  "created_at": "ISO timestamp"
}
```

---

## 🔐 Authentication Flow

```
User enters email/password
        │
        ▼
POST /api/auth/login
        │
        ▼
bcrypt.compare(password, hash)
        │
     ✅ valid
        │
        ▼
signToken(userId) → JWT (stored in localStorage)
        │
        ▼
Frontend attaches JWT via HTTP Interceptor
to every subsequent request header:
  Authorization: Bearer <token>
        │
        ▼
auth.middleware.js verifies JWT on every
protected route — injects req.user
        │
        ▼
Controller handles the request with req.user.id
```

**Google Sign-In Flow:**
```
User clicks "Continue with Google"
        │
        ▼
Google returns idToken to the browser
        │
        ▼
POST /api/auth/google { idToken }
        │
        ▼
Backend verifies token with Google's servers
        │
        ▼
If new user → insert into users + profiles
If existing user → link google_id if missing
        │
        ▼
Return JWT + user object + isNew flag
```

---

## 🤖 How the Chat / Q&A Engine Works

The backend uses a **keyword-based answer engine** (`backend/utils/qa-engine.js`):

1. The user's message is received at `POST /api/chats/:id/messages`
2. The `findAnswer(userContent)` function scans the message for known keywords
3. A matching pre-written answer is returned as the bot response
4. Both the user message and bot message are saved to `messages.json`
5. The session title is auto-set from the first user message (truncated to 50 chars)

> This makes the app fully functional without any external AI API key.

---

## 🚀 Deployment Guide

### Deploy Backend to Render

1. Push the `backend/` folder to a GitHub repository
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo and configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Root Directory:** `backend`
4. Add Environment Variables in Render dashboard:
   - `JWT_SECRET` → your secret key
   - `GOOGLE_CLIENT_ID` → your Google OAuth client ID
   - `PORT` → (Render sets this automatically)
5. Deploy and copy the service URL (e.g. `https://perplexity-clone-backend-xvkc.onrender.com`)

### Deploy Frontend to Render

1. Update `src/app/config/api.config.ts` with your actual backend URL:
   ```typescript
   : 'https://your-backend-url.onrender.com';
   ```
2. Go to Render → **New Static Site**
3. Configure:
   - **Build Command:** `npm install && ng build`
   - **Publish Directory:** `dist/comet-clone/browser`
4. Deploy and visit your live frontend URL

---

## 🧪 Testing the Output

### Quick Smoke Test (Manual)

After starting both servers locally:

**Step 1 — Verify backend is running:**
```
GET http://localhost:3000/health
```
Expected: `{ "status": "healthy", "timestamp": "..." }`

**Step 2 — Register a new user:**
```
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test1234"
}
```
Expected: `201` with a `token` and `user` object.

**Step 3 — Open the frontend:**
```
http://localhost:4200
```
You will be redirected to `/login` automatically.

**Step 4 — Sign up via the UI:**
- Click **Sign Up**, enter email & password
- You will be redirected to `/onboarding`
- Enter your name and phone number, click Continue
- You will land on the **Home** page

**Step 5 — Start a Chat:**
- Click the **New Chat** button in the sidebar (or navigate to `/chat`)
- Type any question such as: `What is machine learning?`
- The bot will respond instantly with a pre-written answer
- The session title will be auto-set from your first message
- Navigate to `/history` to see all your sessions

**Step 6 — Explore pages:**
| Page | URL |
|---|---|
| Discover | `http://localhost:4200/discover` |
| Finance | `http://localhost:4200/finance` |
| Health | `http://localhost:4200/health` |
| Academic | `http://localhost:4200/academic` |
| Patents | `http://localhost:4200/patents` |
| Profile | `http://localhost:4200/profile` |

**Step 7 — Test API with curl or Postman:**
```bash
# Login and capture token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'

# Use the token to list chat sessions
curl http://localhost:3000/api/chats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Verify JSON Database

After signing up and chatting, inspect the data files directly:

```
backend/database/data/users.json          ← your user record
backend/database/data/profiles.json       ← your profile
backend/database/data/chat_sessions.json  ← your chat sessions
backend/database/data/messages.json       ← your messages
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| `ng: command not found` | Run `npm install -g @angular/cli@21` |
| `Cannot GET /` on port 3000 | That's normal — use `/health` to test the backend |
| Frontend shows blank page | Make sure the backend is running on port 3000 |
| Login fails with `401` | Check the password is correct; ensure `JWT_SECRET` is set in `.env` |
| Google Sign-In fails | Verify `GOOGLE_CLIENT_ID` in `.env` matches your Google Cloud Console client |
| Data not persisting | Ensure backend has write permission to `backend/database/data/` |
| CORS error in browser | Backend only allows `localhost:4200` and the Render frontend URL. Check `server.js` `allowedOrigins` |
| Port 3000 already in use | Change `PORT=3001` in `.env` and update `api.config.ts` for dev mode |

---

## 📸 Screenshots

| Page | Description |
|---|---|
| Login | Email/password + Google sign-in |
| Onboarding | Full-name & phone collection |
| Home | Perplexity-style search interface |
| Chat | Multi-turn AI conversation |
| Discover | Trending topic cards |
| Finance | Market & financial data view |
| Profile | Edit profile settings |

---

