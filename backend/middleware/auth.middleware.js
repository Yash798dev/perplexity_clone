const { verifyToken } = require('../utils/jwt.utils');
const db = require('../database/db');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyToken(token);
    const user = db.prepare('SELECT id, email, is_onboarded FROM users WHERE id = ?').get(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found. Please sign in again.' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token. Please sign in again.' });
  }
}

module.exports = { requireAuth };
