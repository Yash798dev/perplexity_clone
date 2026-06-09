-- Users table: core authentication record
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  google_id   TEXT UNIQUE,
  is_onboarded INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Profiles table: extended user information
CREATE TABLE IF NOT EXISTS profiles (
  user_id     TEXT PRIMARY KEY,
  full_name   TEXT NOT NULL DEFAULT '',
  phone_number TEXT NOT NULL DEFAULT '',
  avatar_url  TEXT NOT NULL DEFAULT '',
  bio         TEXT NOT NULL DEFAULT '',
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat sessions table: each represents one conversation thread
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  title       TEXT NOT NULL DEFAULT 'New Chat',
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table: individual messages within a session
CREATE TABLE IF NOT EXISTS messages (
  id          TEXT PRIMARY KEY,
  session_id  TEXT NOT NULL,
  role        TEXT NOT NULL CHECK(role IN ('user', 'bot')),
  content     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
