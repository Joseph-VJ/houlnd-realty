/**
 * Authentication Routes Integration Tests
 */

import request from 'supertest';
import app from '../../src/app';

// Mock the database
jest.mock('../../src/config/database', () => ({
  query: jest.fn(),
  transaction: jest.fn(),
  healthCheck: jest.fn().mockResolvedValue(true),
  closePool: jest.fn()
}));

// Mock Redis
jest.mock('../../src/config/redis', () => ({
  getRedisClient: jest.fn().mockResolvedValue({
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    sendCommand: jest.fn()
  }),
  isRedisAvailable: jest.fn().mockResolvedValue(false),
  tokenBlacklist: {
    add: jest.fn(),
    isBlacklisted: jest.fn().mockResolvedValue(false)
  },
  rateLimitStore: {
    increment: jest.fn().mockResolvedValue({ count: 1, resetTime: Date.now() + 60000 }),
    getCount: jest.fn().mockResolvedValue(0),
    reset: jest.fn()
  },
  closeRedis: jest.fn()
}));

import { query, transaction } from '../../src/config/database';
import { JWTService } from '../../src/utils/jwt';
import { hashPassword } from '../../src/utils/password';

const mockedQuery = query as jest.Mock;
const mockedTransaction = transaction as jest.Mock;

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock no existing user
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Check email
      
      // Mock user creation
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        phone: null,
        full_name: 'Test User',
        role: 'CUSTOMER',
        email_verified: false,
        phone_verified: false,
        profile_photo_url: null,
        login_count: 0,
        last_login_at: null,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockedQuery.mockResolvedValueOnce({ rows: [mockUser] }); // Insert user
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Email verification token
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Store refresh token

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'MyStr0ng!Pass',
          full_name: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should reject registration with existing email', async () => {
      // Mock existing user
      mockedQuery.mockResolvedValueOnce({
        rows: [{ id: 'existing-id' }]
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'MyStr0ng!Pass',
          full_name: 'Test User'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.errorCode).toBe('EMAIL_EXISTS');
    });

    it('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'weak',
          full_name: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errorCode).toBe('INVALID_PASSWORD');
    });

    it('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.errorCode).toBe('MISSING_FIELDS');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'MyStr0ng!Pass',
          full_name: 'Test User'
        });

      expect(response.status).toBe(400);
      expect(response.body.errorCode).toBe('INVALID_EMAIL');
    });
  });

  describe('POST /api/auth/login', () => {
    const mockUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      phone: null,
      full_name: 'Test User',
      role: 'CUSTOMER',
      email_verified: true,
      phone_verified: false,
      profile_photo_url: null,
      login_count: 5,
      last_login_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      password_hash: '', // Will be set in test
      failed_login_attempts: 0,
      account_locked_until: null
    };

    beforeEach(async () => {
      mockUser.password_hash = await hashPassword('MyStr0ng!Pass');
    });

    it('should login successfully with correct credentials', async () => {
      mockedQuery.mockResolvedValueOnce({ rows: [mockUser] }); // Get user
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Update login info
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Store refresh token
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Log login attempt

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'MyStr0ng!Pass'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should reject login with wrong password', async () => {
      mockedQuery.mockResolvedValueOnce({ rows: [mockUser] }); // Get user
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Update failed attempts
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Log attempt

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.errorCode).toBe('INVALID_CREDENTIALS');
    });

    it('should reject login for non-existent user', async () => {
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // No user found
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Log attempt

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'AnyPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.errorCode).toBe('INVALID_CREDENTIALS');
    });

    it('should reject login for locked account', async () => {
      const lockedUser = {
        ...mockUser,
        account_locked_until: new Date(Date.now() + 15 * 60 * 1000) // Locked for 15 mins
      };

      mockedQuery.mockResolvedValueOnce({ rows: [lockedUser] });
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Log attempt

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'MyStr0ng!Pass'
        });

      expect(response.status).toBe(423);
      expect(response.body.errorCode).toBe('ACCOUNT_LOCKED');
    });

    it('should reject missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errorCode).toBe('MISSING_FIELDS');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const tokenPayload = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        role: 'CUSTOMER' as const,
        sessionId: 'session-id'
      };

      const refreshToken = JWTService.generateRefreshToken(tokenPayload);
      const tokenHash = JWTService.hashToken(refreshToken);

      // Mock token lookup
      mockedQuery.mockResolvedValueOnce({
        rows: [{ id: 'token-id', user_id: tokenPayload.userId }]
      });

      // Mock user lookup
      mockedQuery.mockResolvedValueOnce({
        rows: [{ id: tokenPayload.userId, email: tokenPayload.email, role: 'CUSTOMER' }]
      });

      // Mock token revocation
      mockedQuery.mockResolvedValueOnce({ rows: [] });

      // Mock new token storage
      mockedQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(response.status).toBe(401);
      expect(response.body.errorCode).toBe('NO_REFRESH_TOKEN');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const tokenPayload = {
        userId: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        role: 'CUSTOMER' as const
      };

      const accessToken = JWTService.generateAccessToken(tokenPayload);

      const mockUser = {
        id: tokenPayload.userId,
        email: tokenPayload.email,
        full_name: 'Test User',
        role: 'CUSTOMER',
        email_verified: true
      };

      mockedQuery.mockResolvedValueOnce({ rows: [mockUser] });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.errorCode).toBe('NO_TOKEN');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body.errorCode).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should send reset email for existing user', async () => {
      mockedQuery.mockResolvedValueOnce({
        rows: [{ id: 'user-id', email: 'test@example.com' }]
      });
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Invalidate old tokens
      mockedQuery.mockResolvedValueOnce({ rows: [] }); // Create new token

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return success for non-existent email (prevent enumeration)', async () => {
      mockedQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errorCode).toBe('MISSING_EMAIL');
    });
  });

  describe('GET /api/auth/password-requirements', () => {
    it('should return password requirements', async () => {
      const response = await request(app)
        .get('/api/auth/password-requirements');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.minLength).toBeDefined();
      expect(response.body.data.requireUppercase).toBeDefined();
    });
  });

  describe('POST /api/auth/validate-password', () => {
    it('should validate a strong password', async () => {
      const response = await request(app)
        .post('/api/auth/validate-password')
        .send({ password: 'MyStr0ng!Pass' });

      expect(response.status).toBe(200);
      expect(response.body.data.valid).toBe(true);
      expect(response.body.data.errors).toHaveLength(0);
    });

    it('should return errors for weak password', async () => {
      const response = await request(app)
        .post('/api/auth/validate-password')
        .send({ password: 'weak' });

      expect(response.status).toBe(200);
      expect(response.body.data.valid).toBe(false);
      expect(response.body.data.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Health Endpoints', () => {
    it('GET /health should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBeDefined();
      expect(response.body.services).toBeDefined();
    });

    it('GET /ready should return ready status', async () => {
      const response = await request(app).get('/ready');

      expect(response.status).toBe(200);
      expect(response.body.ready).toBe(true);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown/route');

      expect(response.status).toBe(404);
      expect(response.body.errorCode).toBe('NOT_FOUND');
    });
  });
});
