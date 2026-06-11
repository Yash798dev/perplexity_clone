# 🌠 Comet — Perplexity AI Clone

A full-stack, pixel-perfect clone of **Perplexity AI**, built with **Angular 21** on the frontend and **Node.js / Express** on the backend. Comet features real user authentication (email/password + Google OAuth), persistent chat sessions, an AI-powered Q&A engine, and a rich multi-page UI covering Search, Discover, Finance, Health, Academic, Patents, Spaces, and more.

> **Live Demo**
> - 🌐 Frontend: [https://perplexity-clone-xvkc.onrender.com](https://perplexity-clone-xvkc.onrender.com)
> - ⚙️ Backend API: [https://perplexity-clone-backend.onrender.com](https://perplexity-clone-backend.onrender.com)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Folder Structure](#-folder-structure)
4. [Prerequisites](#-prerequisites)
5. [Local Setup — Step by Step](#-local-setup--step-by-step)
6. [Environment Variables](#-environment-variables)
7. [Application Routes (Pages)](#-application-routes-pages)
8. [Backend API Reference](#-backend-api-reference)
9. [Database Architecture](#-database-architecture)
10. [Authentication Flow](#-authentication-flow)
11. [How the Chat / Q&A Engine Works](#-how-the-chat--qa-engine-works)
12. [Deployment & Google OAuth Configuration](#-deployment--google-oauth-configuration)
13. [Running Tests](#-running-tests)
14. [Troubleshooting](#-troubleshooting)

---

## 🚀 Project Overview

Comet is a production-ready Perplexity.ai clone featuring:
- **User Authentication** — Secure signup, login, Google Sign-In, and JWT-secured routes.
- **Onboarding Flow** — Profile setup (fullname, phone number) for new users.
- **SQLite Database** — A robust database using `better-sqlite3` replacing loose JSON files, utilizing WAL mode and foreign key constraints.
- **Real Backend Search** — A centralized Search API connecting the frontend directly to a backend QA Engine.
- **Token Security** — Token storage migrated to `sessionStorage` (clearing on tab close) to guard against persistent XSS.
- **Data Validation & Sanitization** — String validation (via `validator` package) enforcing valid emails and strong passwords (min 8 chars).
- **Discovery Pages** — Dedicated search/discover feeds for Academic, Patents, Finance, and Health.
- **Profile Management** — Update names, phone numbers, bio, and avatars.

---

## 🛠 Tech Stack

### Frontend
- **Angular 21.x** (SPA Framework)
- **TypeScript 5.9.x** (Type Safety)
- **SCSS** (Vanilla Component Styling)
- **RxJS 7.8.x** (State & Http streams)

### Backend
- **Node.js ≥ 18** & **Express.js 4.x**
- **better-sqlite3** (SQLite Database driver)
- **bcryptjs 2.x** (Password hashing)
- **jsonwebtoken 9.x** (JWT signing & verification)
- **google-auth-library 9.x** (Google ID token validation)
- **validator 13.x** (Email & password string validation)
- **supertest 6.x** & **jest 29.x** (Test framework)

---

## 📁 Folder Structure

```
comet_clone/
├── src/                          # Angular frontend source
│   ├── app/
│   │   ├── components/           # UI Components
│   │   │   ├── home/             # Landing / Search page
│   │   │   ├── chat/             # Chat session thread view
│   │   │   ├── discover/         # Discover feed cards
│   │   │   ├── login/            # Secure sign-in form
│   │   │   ├── signup/           # Password validation signup form
│   │   │   ├── onboarding/       # Name/phone entry
│   │   │   └── ...
│   │   ├── config/
│   │   │   └── api.config.ts     # Centralized backend URL
│   │   ├── guards/               # authGuard & onboardingGuard
│   │   ├── interceptors/         # authInterceptor (sessionStorage JWT header)
│   │   ├── services/             # auth.service.ts, search.service.ts
│   │   └── app.routes.ts         # Angular page router mapping
│   ├── environments/             # Client-side configuration
│   │   ├── environment.ts        # Dev environment variables
│   │   └── environment.prod.ts   # Production environment variables
│   ├── main.ts
│   └── styles.scss               # Global styles & theme values
│
├── backend/                      # Node.js backend source
│   ├── controllers/              # Request handlers (auth, chat, user, search)
│   ├── database/
│   │   ├── db.js                 # SQLite connection & WAL runner initialization
│   │   └── schema.sql            # SQLite database schema
│   ├── middleware/               # auth.middleware, error.middleware
│   ├── routes/                   # auth.routes, user.routes, chat.routes, search.routes
│   ├── utils/                    # jwt.utils, qa-engine, validation.utils
│   ├── tests/                    # Jest integration test suites (auth, chat)
│   ├── server.js                 # Express application entry & JWT safety guard
│   ├── package.json              # Backend scripts & packages
│   └── .env                      # Local server configuration (Git ignored)
│
├── angular.json                  # Angular CLI compiler settings
├── package.json                  # Frontend script commands
└── README.md
```

---

## ✅ Prerequisites

Ensure the following tools are installed locally:
- **Node.js** (v18.x or higher) -> verify with `node -v`
- **npm** (v9.x or higher) -> verify with `npm -v`
- **Angular CLI** (v21.x or higher) -> install globally via `npm install -g @angular/cli`

---

## ⚙️ Local Setup — Step by Step

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the template environment variables:
   ```bash
   copy .env.example .env
   ```
4. Open your newly created `.env` and fill in the values:
   - Make sure to set a secure random string for `JWT_SECRET`.
   - Add your Google OAuth client ID to `GOOGLE_CLIENT_ID`.

The SQLite database file `comet.db` will be initialized automatically inside `backend/database/` on first server start.

---

### 2. Frontend Setup
1. From the project root (`comet_clone/`), install the frontend dependencies:
   ```bash
   npm install
   ```
2. The Angular app uses compile-time environment swap settings (`angular.json`) which replaces `environment.ts` with `environment.prod.ts` on builds.

---

### 3. Running the Application Locally
You will need two terminal windows open:

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend Client):**
```bash
npm start
```
Your default browser will launch at `http://localhost:4200`.

---

## 🔑 Environment Variables

### Backend Configuration (`backend/.env`)
| Variable | Description | Default / Format |
|---|---|---|
| `PORT` | Listening port for the express server | `3000` |
| `NODE_ENV` | Run-time mode | `development` |
| `JWT_SECRET` | Cryptographic secret for signing tokens | Minimum 32-character string |
| `GOOGLE_CLIENT_ID` | Client identifier from Google Cloud Console | `xxxx-xxxx.apps.googleusercontent.com` |
| `DB_PATH` | Path where the SQLite `.db` file is stored | `./database/comet.db` |
| `FRONTEND_URL` | Cross-Origin Allowed Origin URL | `http://localhost:4200` |

---

## 🗺 Application Routes (Pages)

- `/login` - Sign-in page with Google OAuth option.
- `/signup` - Sign-up page enforcing email syntax and 8-character passwords.
- `/onboarding` - Collects profile name and phone number on first login.
- `/` - Main landing page with a Perplexity-style search interface.
- `/search?q=query` - Fetches and displays answers from the API.
- `/chat` - Directs to a new messaging session.
- `/chat/:id` - Loads and allows continuing an existing session.
- `/history` - Lists past chat sessions with deletion controls.
- `/profile` - Updates personal details, bio, and avatar URLs.

---

## 📡 Backend API Reference

| Endpoint | Method | Authorization | Description |
|---|---|---|---|
| `/api/auth/signup` | POST | None | Signs up user with email & password |
| `/api/auth/login` | POST | None | Logs user in and yields JWT token |
| `/api/auth/google` | POST | None | Authorizes a Google Sign-In with an ID token |
| `/api/auth/me` | GET | Bearer Token | Fetches authenticated user info |
| `/api/user/profile` | PUT | Bearer Token | Updates full name, avatar, bio |
| `/api/user/onboarding` | POST | Bearer Token | Marks onboarding complete |
| `/api/chats` | GET | Bearer Token | Lists all active user chat sessions |
| `/api/chats` | POST | Bearer Token | Creates a new chat session |
| `/api/chats/:id` | DELETE | Bearer Token | Deletes a chat session & messages |
| `/api/chats/:id/messages` | GET | Bearer Token | Fetches message history for a session |
| `/api/chats/:id/messages` | POST | Bearer Token | Posts user message, triggers bot reply |
| `/api/search` | GET | None | Queries the backend Q&A engine directly |

---

## 🗄 Database Architecture

The SQLite schema initializes the following relational structure:
- **`users`** — Primary user accounts. Holds emails, password hashes, and Google IDs.
- **`profiles`** — Profile details linked to users via foreign keys with cascade deletions.
- **`chat_sessions`** — Chat sessions linked to a user.
- **`messages`** — Chat history logs with roles (`user` or `bot`) linked to a session.

---

## 🔐 Authentication Flow

1. User submits credentials (or Google OAuth credential).
2. The server verifies passwords via `bcryptjs` (or IDs via Google OAuth client).
3. The server signs a JSON Web Token (JWT) using the `JWT_SECRET`.
4. The client receives the token and stores it in **`sessionStorage`** to prevent cross-tab persistent XSS risks.
5. The Angular `authInterceptor` reads the token from `sessionStorage` and prefixes all requests with `Authorization: Bearer <token>`.

---

## 🤖 How the Chat / Q&A Engine Works

1. Search requests hit the backend `/api/search?q=query` endpoint.
2. The endpoint calls `findAnswer()` within `backend/utils/qa-engine.js`.
3. The query is evaluated using keyword frequency matches against a local corpus.
4. The matching answer text is sent back as JSON.
5. In chat threads, the first message's answer is streamed to the UI, and the query is used to auto-name the chat session.

---

## 🚀 Deployment & Google OAuth Configuration

### Solving Google OAuth `origin_mismatch` on Render
When running the app on a live domain (e.g. `https://perplexity-clone-xvkc.onrender.com`), you must configure authorization origins in Google Console:

1. Visit [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Edit your OAuth 2.0 Web Client.
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:4200` (for local development)
   - `https://perplexity-clone-xvkc.onrender.com` (your live Render frontend domain)
4. Under **Authorized redirect URIs**, configure redirect endpoints if necessary.
5. Save the configuration (changes apply in roughly 5 minutes).

### Environment Synchronization
- Ensure `environment.ts` and `environment.prod.ts` have correct Google Client IDs.
- The backend on Render must have its environment variables configured in the Render Dashboard (specifically `JWT_SECRET` and `GOOGLE_CLIENT_ID`).

---

## 🧪 Running Tests

### Backend Unit & Integration Tests
Backend tests use a temporary isolated database that spins up in your operating system's temp folder.
1. Run the test suite:
   ```bash
   cd backend
   npm test
   ```
2. Verify all 28 checks pass.

### Frontend Unit Tests
1. Run the Angular test runner:
   ```bash
   ng test --watch=false
   ```

---

## 🔧 Troubleshooting

- **Google Auth Error 400 (origin_mismatch):** Ensure the Render domain is in Google Credentials' Authorized JavaScript Origins list.
- **Database read-only errors:** Ensure the database folder `backend/database/` has read/write filesystem permissions on your hosting server.
- **Production secret warnings:** The server will crash on launch in `production` mode if the default development JWT key is used. Set a strong custom secret.
