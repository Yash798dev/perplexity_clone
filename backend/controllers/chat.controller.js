const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { findAnswer } = require('../utils/qa-engine');

function listSessions(req, res, next) {
  try {
    const sessions = db.prepare(`
      SELECT id, title, created_at, updated_at
      FROM chat_sessions
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `).all(req.user.id);
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
}

function createSession(req, res, next) {
  try {
    const { title } = req.body;
    const sessionId = uuidv4();
    const sessionTitle = (title && title.trim()) ? title.trim() : 'New Chat';

    db.prepare(`
      INSERT INTO chat_sessions (id, user_id, title)
      VALUES (?, ?, ?)
    `).run(sessionId, req.user.id, sessionTitle);

    const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(sessionId);
    res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
}

function deleteSession(req, res, next) {
  try {
    const { id } = req.params;
    const session = db.prepare('SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found.' });
    }
    db.prepare('DELETE FROM chat_sessions WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

function getMessages(req, res, next) {
  try {
    const { id } = req.params;
    const session = db.prepare('SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found.' });
    }
    const messages = db.prepare(`
      SELECT id, role, content, created_at
      FROM messages
      WHERE session_id = ?
      ORDER BY created_at ASC
    `).all(id);
    res.json({ messages });
  } catch (err) {
    next(err);
  }
}

function sendMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found.' });
    }

    const userMsgId = uuidv4();
    const userContent = content.trim();

    db.prepare(`
      INSERT INTO messages (id, session_id, role, content)
      VALUES (?, ?, 'user', ?)
    `).run(userMsgId, id, userContent);

    // Update session title from first user message
    const msgCount = db.prepare('SELECT COUNT(*) as cnt FROM messages WHERE session_id = ?').get(id);
    if (msgCount.cnt === 1) {
      const shortTitle = userContent.length > 50 ? userContent.slice(0, 50) + '…' : userContent;
      db.prepare(`UPDATE chat_sessions SET title = ?, updated_at = datetime('now') WHERE id = ?`).run(shortTitle, id);
    } else {
      db.prepare(`UPDATE chat_sessions SET updated_at = datetime('now') WHERE id = ?`).run(id);
    }

    const botAnswer = findAnswer(userContent);
    const botMsgId = uuidv4();

    db.prepare(`
      INSERT INTO messages (id, session_id, role, content)
      VALUES (?, ?, 'bot', ?)
    `).run(botMsgId, id, botAnswer);

    const userMsg = db.prepare('SELECT id, role, content, created_at FROM messages WHERE id = ?').get(userMsgId);
    const botMsg = db.prepare('SELECT id, role, content, created_at FROM messages WHERE id = ?').get(botMsgId);
    const updatedSession = db.prepare('SELECT id, title, created_at, updated_at FROM chat_sessions WHERE id = ?').get(id);

    res.json({ userMessage: userMsg, botMessage: botMsg, session: updatedSession });
  } catch (err) {
    next(err);
  }
}

module.exports = { listSessions, createSession, deleteSession, getMessages, sendMessage };
