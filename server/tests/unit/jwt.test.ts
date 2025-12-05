/**
 * JWT Service Unit Tests
 */

import { JWTService, TokenPayload } from '../../src/utils/jwt';

describe('JWTService', () => {
  const mockPayload: TokenPayload = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    role: 'CUSTOMER',
    sessionId: '987fcdeb-51a2-3b4c-d5e6-789012345678'
  };

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const token = JWTService.generateAccessToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT format: header.payload.signature
    });

    it('should include user data in token', () => {
      const token = JWTService.generateAccessToken(mockPayload);
      const decoded = JWTService.decodeToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(mockPayload.userId);
      expect(decoded?.email).toBe(mockPayload.email);
      expect(decoded?.role).toBe(mockPayload.role);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const token = JWTService.generateRefreshToken(mockPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should have different signature than access token', () => {
      const accessToken = JWTService.generateAccessToken(mockPayload);
      const refreshToken = JWTService.generateRefreshToken(mockPayload);
      
      expect(accessToken).not.toBe(refreshToken);
    });
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', () => {
      const pair = JWTService.generateTokenPair(mockPayload);
      
      expect(pair.accessToken).toBeDefined();
      expect(pair.refreshToken).toBeDefined();
      expect(pair.accessTokenExpiresAt).toBeInstanceOf(Date);
      expect(pair.refreshTokenExpiresAt).toBeInstanceOf(Date);
    });

    it('should have refresh token expire later than access token', () => {
      const pair = JWTService.generateTokenPair(mockPayload);
      
      expect(pair.refreshTokenExpiresAt.getTime())
        .toBeGreaterThan(pair.accessTokenExpiresAt.getTime());
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = JWTService.generateAccessToken(mockPayload);
      const result = JWTService.verifyAccessToken(token);
      
      expect(result.valid).toBe(true);
      expect(result.expired).toBe(false);
      expect(result.payload?.userId).toBe(mockPayload.userId);
    });

    it('should reject an invalid token', () => {
      const result = JWTService.verifyAccessToken('invalid.token.here');
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject a refresh token as access token', () => {
      const refreshToken = JWTService.generateRefreshToken(mockPayload);
      const result = JWTService.verifyAccessToken(refreshToken);
      
      expect(result.valid).toBe(false);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = JWTService.generateRefreshToken(mockPayload);
      const result = JWTService.verifyRefreshToken(token);
      
      expect(result.valid).toBe(true);
      expect(result.expired).toBe(false);
      expect(result.payload?.userId).toBe(mockPayload.userId);
    });

    it('should reject an access token as refresh token', () => {
      const accessToken = JWTService.generateAccessToken(mockPayload);
      const result = JWTService.verifyRefreshToken(accessToken);
      
      expect(result.valid).toBe(false);
    });
  });

  describe('hashToken', () => {
    it('should generate consistent hash for same input', () => {
      const token = 'test-token-12345';
      const hash1 = JWTService.hashToken(token);
      const hash2 = JWTService.hashToken(token);
      
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = JWTService.hashToken('token1');
      const hash2 = JWTService.hashToken('token2');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should return a hex string', () => {
      const hash = JWTService.hashToken('test');
      
      expect(hash).toMatch(/^[a-f0-9]+$/);
    });
  });

  describe('extractFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoiZGF0YSJ9.signature';
      const header = `Bearer ${token}`;
      
      const extracted = JWTService.extractFromHeader(header);
      
      expect(extracted).toBe(token);
    });

    it('should return null for missing header', () => {
      expect(JWTService.extractFromHeader(undefined)).toBeNull();
    });

    it('should return null for invalid format', () => {
      expect(JWTService.extractFromHeader('Basic token')).toBeNull();
      expect(JWTService.extractFromHeader('Bearer')).toBeNull();
      expect(JWTService.extractFromHeader('token')).toBeNull();
    });

    it('should be case-insensitive for Bearer', () => {
      const token = 'test-token';
      
      expect(JWTService.extractFromHeader(`bearer ${token}`)).toBe(token);
      expect(JWTService.extractFromHeader(`BEARER ${token}`)).toBe(token);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate a random hex string', () => {
      const token = JWTService.generateSecureToken(32);
      
      expect(token).toMatch(/^[a-f0-9]+$/);
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
    });

    it('should generate unique tokens', () => {
      const token1 = JWTService.generateSecureToken();
      const token2 = JWTService.generateSecureToken();
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('generateTokenId', () => {
    it('should generate a valid UUID', () => {
      const id = JWTService.generateTokenId();
      
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });
  });

  describe('isAboutToExpire', () => {
    it('should return true for tokens about to expire', () => {
      // Default token expires in 15 minutes, check with 20 minute threshold
      const token = JWTService.generateAccessToken(mockPayload);
      
      // Check with 20 minute threshold - should be true since token expires in 15 min
      expect(JWTService.isAboutToExpire(token, 20)).toBe(true);
    });

    it('should return false for fresh tokens', () => {
      const token = JWTService.generateAccessToken(mockPayload);
      
      // Token expires in 15 min, threshold is 1 min
      expect(JWTService.isAboutToExpire(token, 1)).toBe(false);
    });
  });

  describe('getTimeToExpiry', () => {
    it('should return positive milliseconds for valid token', () => {
      const token = JWTService.generateAccessToken(mockPayload);
      const ttl = JWTService.getTimeToExpiry(token);
      
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(15 * 60 * 1000); // Max 15 minutes
    });

    it('should return 0 for invalid token', () => {
      expect(JWTService.getTimeToExpiry('invalid')).toBe(0);
    });
  });
});
