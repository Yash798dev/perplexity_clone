/**
 * Auth Route Integration Tests
 * Uses a temporary SQLite file so better-sqlite3 is isolated per test run.
 */
const path = require('path');
const os = require('os');
const fs = require('fs');

// MUST set env vars before requiring app/db (module caching)
const testDbPath = path.join(os.tmpdir(), `comet_test_auth_${Date.now()}.db`);
process.env.DB_PATH = testDbPath;
process.env.JWT_SECRET = 'test_jwt_secret_for_auth_tests_only_32chars';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';

const request = require('supertest');
// Require app AFTER env vars are set so db.js picks up the test DB path
const app = require('../server');

afterAll(() => {
  // Clean up temp DB file
  try { fs.unlinkSync(testDbPath); } catch {}
  try { fs.unlinkSync(testDbPath + '-shm'); } catch {}
  try { fs.unlinkSync(testDbPath + '-wal'); } catch {}
});

describe('Auth Routes', () => {
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';

  describe('POST /api/auth/signup', () => {
    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ password: testPassword });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: testEmail });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'not-an-email', password: testPassword });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/valid email/i);
    });

    it('should return 400 when password is too short (< 8 chars)', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: testEmail, password: 'abc' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/8 characters/i);
    });

    it('should create a new user and return a JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: testEmail, password: testPassword });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testEmail.toLowerCase());
      expect(res.body.user.isOnboarded).toBe(false);
    });

    it('should return 409 for a duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: testEmail, password: testPassword });
      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already exists/i);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 when fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail });
      expect(res.status).toBe(400);
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'WrongPass999!' });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid/i);
    });

    it('should return 401 for an unknown email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: testPassword });
      expect(res.status).toBe(401);
    });

    it('should log in successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(testEmail.toLowerCase());
    });
  });

  describe('POST /api/auth/google', () => {
    it('should return 400 when idToken is missing', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/token/i);
    });

    it('should return 401 for an invalid google token', async () => {
      const res = await request(app)
        .post('/api/auth/google')
        .send({ idToken: 'fake.google.token' });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid/i);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });
      authToken = res.body.token;
    });

    it('should return 401 without a token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return 401 with an invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');
      expect(res.status).toBe(401);
    });

    it('should return user data with a valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testEmail.toLowerCase());
    });
  });
});
