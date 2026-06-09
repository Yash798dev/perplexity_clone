const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const tableFiles = {
  users: path.join(dbDir, 'users.json'),
  profiles: path.join(dbDir, 'profiles.json'),
  chat_sessions: path.join(dbDir, 'chat_sessions.json'),
  messages: path.join(dbDir, 'messages.json'),
};

// Initialize JSON files if they don't exist
Object.entries(tableFiles).forEach(([table, filePath]) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
  }
});

// Helper to load/save tables
function readTable(table) {
  try {
    const data = fs.readFileSync(tableFiles[table], 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading table ${table}:`, err);
    return [];
  }
}

function writeTable(table, data) {
  try {
    fs.writeFileSync(tableFiles[table], JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing table ${table}:`, err);
  }
}

/**
 * A mock SQL Query Parser & Execution Engine in JS
 * It parses the SQL queries used in the controllers and maps them to pure JS operations on JSON.
 * This guarantees 100% compatibility with the controller code without modifying them.
 */
function prepare(sql) {
  const normalizedSql = sql.replace(/\s+/g, ' ').trim();

  return {
    get(...args) {
      // 1. SELECT id, email, is_onboarded FROM users WHERE id = ?
      if (normalizedSql.startsWith('SELECT id, email, is_onboarded FROM users WHERE id = ?')) {
        const users = readTable('users');
        const user = users.find(u => u.id === args[0]);
        return user ? { id: user.id, email: user.email, is_onboarded: user.is_onboarded } : undefined;
      }

      // 2. SELECT id FROM users WHERE email = ?
      if (normalizedSql.startsWith('SELECT id FROM users WHERE email = ?')) {
        const users = readTable('users');
        const user = users.find(u => u.email === args[0]);
        return user ? { id: user.id } : undefined;
      }

      // 3. SELECT * FROM profiles WHERE user_id = ?
      if (normalizedSql.startsWith('SELECT * FROM profiles WHERE user_id = ?')) {
        const profiles = readTable('profiles');
        const profile = profiles.find(p => p.user_id === args[0]);
        return profile || undefined;
      }

      // 4. SELECT * FROM users WHERE email = ?
      if (normalizedSql.startsWith('SELECT * FROM users WHERE email = ?')) {
        const users = readTable('users');
        const user = users.find(u => u.email === args[0]);
        return user || undefined;
      }

      // 5. SELECT * FROM users WHERE google_id = ? OR email = ?
      if (normalizedSql.startsWith('SELECT * FROM users WHERE google_id = ? OR email = ?')) {
        const users = readTable('users');
        const user = users.find(u => u.google_id === args[0] || u.email === args[1]);
        return user || undefined;
      }

      // 6. SELECT * FROM users WHERE id = ?
      if (normalizedSql.startsWith('SELECT * FROM users WHERE id = ?')) {
        const users = readTable('users');
        const user = users.find(u => u.id === args[0]);
        return user || undefined;
      }

      // 7. SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?
      if (normalizedSql.startsWith('SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?')) {
        const sessions = readTable('chat_sessions');
        const sess = sessions.find(s => s.id === args[0] && s.user_id === args[1]);
        return sess ? { id: sess.id } : undefined;
      }

      // 8. SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?
      if (normalizedSql.startsWith('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?')) {
        const sessions = readTable('chat_sessions');
        const sess = sessions.find(s => s.id === args[0] && s.user_id === args[1]);
        return sess || undefined;
      }

      // 9. SELECT COUNT(*) as cnt FROM messages WHERE session_id = ?
      if (normalizedSql.startsWith('SELECT COUNT(*) as cnt FROM messages WHERE session_id = ?')) {
        const messages = readTable('messages');
        const cnt = messages.filter(m => m.session_id === args[0]).length;
        return { cnt };
      }

      // 10. SELECT id, role, content, created_at FROM messages WHERE id = ?
      if (normalizedSql.startsWith('SELECT id, role, content, created_at FROM messages WHERE id = ?')) {
        const messages = readTable('messages');
        const msg = messages.find(m => m.id === args[0]);
        return msg || undefined;
      }

      // 11. SELECT id, title, created_at, updated_at FROM chat_sessions WHERE id = ?
      if (normalizedSql.startsWith('SELECT id, title, created_at, updated_at FROM chat_sessions WHERE id = ?')) {
        const sessions = readTable('chat_sessions');
        const sess = sessions.find(s => s.id === args[0]);
        return sess || undefined;
      }

      // 12. SELECT * FROM chat_sessions WHERE id = ?
      if (normalizedSql.startsWith('SELECT * FROM chat_sessions WHERE id = ?')) {
        const sessions = readTable('chat_sessions');
        const sess = sessions.find(s => s.id === args[0]);
        return sess || undefined;
      }

      console.warn('Unhandled GET query:', normalizedSql, args);
      return undefined;
    },

    all(...args) {
      // 1. SELECT id, title, created_at, updated_at FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC
      if (normalizedSql.includes('FROM chat_sessions WHERE user_id = ?')) {
        const sessions = readTable('chat_sessions');
        return sessions
          .filter(s => s.user_id === args[0])
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .map(s => ({ id: s.id, title: s.title, created_at: s.created_at, updated_at: s.updated_at }));
      }

      // 2. SELECT id, role, content, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC
      if (normalizedSql.includes('FROM messages WHERE session_id = ?')) {
        const messages = readTable('messages');
        return messages
          .filter(m => m.session_id === args[0])
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map(m => ({ id: m.id, role: m.role, content: m.content, created_at: m.created_at }));
      }

      console.warn('Unhandled ALL query:', normalizedSql, args);
      return [];
    },

    run(...args) {
      // 1. INSERT INTO users
      if (normalizedSql.startsWith('INSERT INTO users')) {
        const users = readTable('users');
        users.push({
          id: args[0],
          email: args[1],
          password_hash: args[2],
          google_id: args[3] || null,
          is_onboarded: args[4] || 0,
          created_at: new Date().toISOString()
        });
        writeTable('users', users);
        return { changes: 1 };
      }

      // 2. INSERT INTO profiles
      if (normalizedSql.startsWith('INSERT INTO profiles')) {
        const profiles = readTable('profiles');
        profiles.push({
          user_id: args[0],
          full_name: args[1] || '',
          phone_number: args[2] || '',
          avatar_url: args[3] || '',
          bio: args[4] || '',
          updated_at: new Date().toISOString()
        });
        writeTable('profiles', profiles);
        return { changes: 1 };
      }

      // 3. UPDATE users SET google_id = ? WHERE id = ?
      if (normalizedSql.startsWith('UPDATE users SET google_id = ? WHERE id = ?')) {
        const users = readTable('users');
        const user = users.find(u => u.id === args[1]);
        if (user) {
          user.google_id = args[0];
          writeTable('users', users);
        }
        return { changes: user ? 1 : 0 };
      }

      // 4. UPDATE profiles SET full_name = ?, phone_number = ?, avatar_url = ?, bio = ?, updated_at = datetime('now') WHERE user_id = ?
      // or similar
      if (normalizedSql.startsWith('UPDATE profiles SET full_name = ?, phone_number = ?, avatar_url = ?, bio = ?')) {
        const profiles = readTable('profiles');
        const profile = profiles.find(p => p.user_id === args[4]);
        if (profile) {
          profile.full_name = args[0];
          profile.phone_number = args[1];
          profile.avatar_url = args[2];
          profile.bio = args[3];
          profile.updated_at = new Date().toISOString();
          writeTable('profiles', profiles);
        }
        return { changes: profile ? 1 : 0 };
      }

      // 5. UPDATE profiles SET full_name = ?, phone_number = ? WHERE user_id = ?
      if (normalizedSql.startsWith('UPDATE profiles SET full_name = ?, phone_number = ?')) {
        const profiles = readTable('profiles');
        const profile = profiles.find(p => p.user_id === args[2]);
        if (profile) {
          profile.full_name = args[0];
          profile.phone_number = args[1];
          profile.updated_at = new Date().toISOString();
          writeTable('profiles', profiles);
        }
        return { changes: profile ? 1 : 0 };
      }

      // 6. UPDATE users SET is_onboarded = 1 WHERE id = ?
      if (normalizedSql.startsWith('UPDATE users SET is_onboarded = 1 WHERE id = ?')) {
        const users = readTable('users');
        const user = users.find(u => u.id === args[0]);
        if (user) {
          user.is_onboarded = 1;
          writeTable('users', users);
        }
        return { changes: user ? 1 : 0 };
      }

      // 7. INSERT INTO chat_sessions
      if (normalizedSql.startsWith('INSERT INTO chat_sessions')) {
        const sessions = readTable('chat_sessions');
        sessions.push({
          id: args[0],
          user_id: args[1],
          title: args[2] || 'New Chat',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        writeTable('chat_sessions', sessions);
        return { changes: 1 };
      }

      // 8. DELETE FROM chat_sessions WHERE id = ?
      if (normalizedSql.startsWith('DELETE FROM chat_sessions WHERE id = ?')) {
        let sessions = readTable('chat_sessions');
        let messages = readTable('messages');
        const originalLength = sessions.length;
        sessions = sessions.filter(s => s.id !== args[0]);
        messages = messages.filter(m => m.session_id !== args[0]);
        writeTable('chat_sessions', sessions);
        writeTable('messages', messages);
        return { changes: originalLength - sessions.length };
      }

      // 9. INSERT INTO messages
      if (normalizedSql.startsWith('INSERT INTO messages')) {
        const messages = readTable('messages');
        const role = normalizedSql.includes("'user'") ? 'user' : 'bot';
        messages.push({
          id: args[0],
          session_id: args[1],
          role: role,
          content: args[2],
          created_at: new Date().toISOString()
        });
        writeTable('messages', messages);
        return { changes: 1 };
      }

      // 10. UPDATE chat_sessions SET title = ?, updated_at = datetime('now') WHERE id = ?
      // or UPDATE chat_sessions SET updated_at = datetime('now') WHERE id = ?
      if (normalizedSql.startsWith('UPDATE chat_sessions SET title = ?')) {
        const sessions = readTable('chat_sessions');
        const sess = sessions.find(s => s.id === args[1]);
        if (sess) {
          sess.title = args[0];
          sess.updated_at = new Date().toISOString();
          writeTable('chat_sessions', sessions);
        }
        return { changes: sess ? 1 : 0 };
      }

      if (normalizedSql.startsWith('UPDATE chat_sessions SET updated_at = datetime')) {
        const sessions = readTable('chat_sessions');
        const sess = sessions.find(s => s.id === args[0]);
        if (sess) {
          sess.updated_at = new Date().toISOString();
          writeTable('chat_sessions', sessions);
        }
        return { changes: sess ? 1 : 0 };
      }

      console.warn('Unhandled RUN query:', normalizedSql, args);
      return { changes: 0 };
    }
  };
}

module.exports = { prepare };
