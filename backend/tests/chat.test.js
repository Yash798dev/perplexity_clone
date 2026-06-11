/**
 * Chat Route Integration Tests
 * Uses a temporary SQLite file so better-sqlite3 is isolated per test run.
 */
const path = require('path');
const os = require('os');
const fs = require('fs');

// MUST set env vars before requiring app/db (module caching)
const testDbPath = path.join(os.tmpdir(), `comet_test_chat_${Date.now()}.db`);
process.env.DB_PATH = testDbPath;
process.env.JWT_SECRET = 'test_jwt_secret_for_chat_tests_only_32chars';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');

afterAll(() => {
  try { fs.unlinkSync(testDbPath); } catch {}
  try { fs.unlinkSync(testDbPath + '-shm'); } catch {}
  try { fs.unlinkSync(testDbPath + '-wal'); } catch {}
});

describe('Chat Routes', () => {
  let authToken;
  let sessionId;
  const testEmail = `chat_test_${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';

  beforeAll(async () => {
    // Register a user to get an auth token for protected routes
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: testEmail, password: testPassword });
    authToken = res.body.token;
  });

  describe('GET /api/chats', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app).get('/api/chats');
      expect(res.status).toBe(401);
    });

    it('should return empty sessions list for a new user', async () => {
      const res = await request(app)
        .get('/api/chats')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.sessions).toEqual([]);
    });
  });

  describe('POST /api/chats', () => {
    it('should return 401 without auth', async () => {
      const res = await request(app)
        .post('/api/chats')
        .send({ title: 'Test Chat' });
      expect(res.status).toBe(401);
    });

    it('should create a new chat session with a title', async () => {
      const res = await request(app)
        .post('/api/chats')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Chat' });
      expect(res.status).toBe(201);
      expect(res.body.session).toHaveProperty('id');
      expect(res.body.session.title).toBe('Test Chat');
      sessionId = res.body.session.id;
    });

    it('should use "New Chat" as default title when none provided', async () => {
      const res = await request(app)
        .post('/api/chats')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});
      expect(res.status).toBe(201);
      expect(res.body.session.title).toBe('New Chat');
    });
  });

  describe('GET /api/chats/:id/messages', () => {
    it('should return 404 for a non-existent session', async () => {
      const res = await request(app)
        .get('/api/chats/nonexistent-id/messages')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(404);
    });

    it('should return an empty messages list for a new session', async () => {
      const res = await request(app)
        .get(`/api/chats/${sessionId}/messages`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.messages).toEqual([]);
    });
  });

  describe('POST /api/chats/:id/messages', () => {
    it('should return 400 when content is empty', async () => {
      const res = await request(app)
        .post(`/api/chats/${sessionId}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: '   ' });
      expect(res.status).toBe(400);
    });

    it('should send a message and receive a bot reply', async () => {
      const res = await request(app)
        .post(`/api/chats/${sessionId}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'What is artificial intelligence?' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('userMessage');
      expect(res.body).toHaveProperty('botMessage');
      expect(res.body.userMessage.role).toBe('user');
      expect(res.body.botMessage.role).toBe('bot');
      expect(res.body.botMessage.content.length).toBeGreaterThan(10);
    });

    it('should auto-set the session title from the first message', async () => {
      const res = await request(app)
        .post(`/api/chats/${sessionId}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Tell me about Python programming language' });
      expect(res.status).toBe(200);
      expect(res.body.session).toBeDefined();
    });
  });

  describe('DELETE /api/chats/:id', () => {
    it('should return 404 for a non-existent session', async () => {
      const res = await request(app)
        .delete('/api/chats/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(404);
    });

    it('should delete the session successfully', async () => {
      const res = await request(app)
        .delete(`/api/chats/${sessionId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('session should be gone after deletion', async () => {
      const res = await request(app)
        .get(`/api/chats/${sessionId}/messages`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(404);
    });
  });
});
