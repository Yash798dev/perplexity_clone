const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const db = require('../database/db');
const { signToken } = require('../utils/jwt.utils');
require('dotenv').config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function buildUserResponse(user, profile) {
  return {
    id: user.id,
    email: user.email,
    isOnboarded: user.is_onboarded === 1,
    fullName: profile?.full_name || '',
    phoneNumber: profile?.phone_number || '',
    avatarUrl: profile?.avatar_url || '',
    bio: profile?.bio || '',
  };
}

async function signup(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, is_onboarded)
      VALUES (?, ?, ?, 0)
    `).run(userId, email.toLowerCase(), passwordHash);

    db.prepare(`
      INSERT INTO profiles (user_id, full_name, phone_number, avatar_url, bio)
      VALUES (?, '', '', '', '')
    `).run(userId);

    const token = signToken(userId);
    const user = db.prepare('SELECT id, email, is_onboarded FROM users WHERE id = ?').get(userId);
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);

    res.status(201).json({ token, user: buildUserResponse(user, profile) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user.id);
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id);

    res.json({ token, user: buildUserResponse(user, profile) });
  } catch (err) {
    next(err);
  }
}

async function googleSignIn(req, res, next) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required.' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ error: 'Invalid Google token.' });
    }

    const { sub: googleId, email, name, picture } = payload;
    let user = db.prepare('SELECT * FROM users WHERE google_id = ? OR email = ?').get(googleId, email.toLowerCase());

    let isNew = false;
    if (!user) {
      const userId = uuidv4();
      db.prepare(`
        INSERT INTO users (id, email, google_id, is_onboarded)
        VALUES (?, ?, ?, 0)
      `).run(userId, email.toLowerCase(), googleId);

      db.prepare(`
        INSERT INTO profiles (user_id, full_name, phone_number, avatar_url, bio)
        VALUES (?, ?, '', ?, '')
      `).run(userId, name || '', picture || '');

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
      isNew = true;
    } else if (!user.google_id) {
      db.prepare('UPDATE users SET google_id = ? WHERE id = ?').run(googleId, user.id);
    }

    const token = signToken(user.id);
    const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(user.id);

    res.json({ token, user: buildUserResponse(user, profile), isNew });
  } catch (err) {
    next(err);
  }
}

function me(req, res) {
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user.id);
  res.json({ user: buildUserResponse(req.user, profile) });
}

module.exports = { signup, login, googleSignIn, me };
