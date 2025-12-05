/**
 * Password Utilities Unit Tests
 */

import {
  validatePassword,
  hashPassword,
  comparePassword,
  generateTemporaryPassword,
  PASSWORD_REQUIREMENTS
} from '../../src/utils/password';

describe('Password Utilities', () => {
  describe('validatePassword', () => {
    it('should accept a strong password', () => {
      const result = validatePassword('MyStr0ng!Pass');
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });

    it('should reject short password', () => {
      const result = validatePassword('Ab1!');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('at least'))).toBe(true);
    });

    it('should reject password without uppercase', () => {
      const result = validatePassword('mystr0ng!pass');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('uppercase'))).toBe(true);
    });

    it('should reject password without lowercase', () => {
      const result = validatePassword('MYSTR0NG!PASS');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('lowercase'))).toBe(true);
    });

    it('should reject password without number', () => {
      const result = validatePassword('MyStrong!Pass');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('number'))).toBe(true);
    });

    it('should reject password without special character', () => {
      const result = validatePassword('MyStr0ngPass');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('special'))).toBe(true);
    });

    it('should reject password with all same characters', () => {
      const result = validatePassword('aaaaaaaaaaa');
      
      expect(result.valid).toBe(false);
    });

    it('should reject common passwords', () => {
      const result = validatePassword('password123!A');
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('common'))).toBe(true);
    });

    it('should collect multiple errors', () => {
      const result = validatePassword('abc');
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('hashPassword', () => {
    it('should generate a bcrypt hash', async () => {
      const hash = await hashPassword('testPassword123');
      
      expect(hash).toBeDefined();
      expect(hash).toMatch(/^\$2[aby]\$/); // bcrypt format
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });

    it('should generate hash of expected length', async () => {
      const hash = await hashPassword('test');
      
      expect(hash.length).toBe(60); // bcrypt hash length
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);
      
      const result = await comparePassword(password, hash);
      
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const hash = await hashPassword('originalPassword');
      
      const result = await comparePassword('wrongPassword', hash);
      
      expect(result).toBe(false);
    });

    it('should handle empty password', async () => {
      const hash = await hashPassword('testPassword');
      
      const result = await comparePassword('', hash);
      
      expect(result).toBe(false);
    });

    it('should be case-sensitive', async () => {
      const hash = await hashPassword('TestPassword');
      
      const result = await comparePassword('testpassword', hash);
      
      expect(result).toBe(false);
    });
  });

  describe('generateTemporaryPassword', () => {
    it('should generate password of specified length', () => {
      const password = generateTemporaryPassword(16);
      
      expect(password.length).toBe(16);
    });

    it('should generate password with default length', () => {
      const password = generateTemporaryPassword();
      
      expect(password.length).toBe(12);
    });

    it('should meet password requirements', () => {
      // Generate multiple passwords to ensure randomness covers requirements
      for (let i = 0; i < 10; i++) {
        const password = generateTemporaryPassword();
        const result = validatePassword(password);
        
        expect(result.valid).toBe(true);
      }
    });

    it('should contain at least one uppercase letter', () => {
      const password = generateTemporaryPassword();
      
      expect(/[A-Z]/.test(password)).toBe(true);
    });

    it('should contain at least one lowercase letter', () => {
      const password = generateTemporaryPassword();
      
      expect(/[a-z]/.test(password)).toBe(true);
    });

    it('should contain at least one number', () => {
      const password = generateTemporaryPassword();
      
      expect(/\d/.test(password)).toBe(true);
    });

    it('should contain at least one special character', () => {
      const password = generateTemporaryPassword();
      
      expect(/[!@#$%^&*]/.test(password)).toBe(true);
    });

    it('should generate unique passwords', () => {
      const passwords = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        passwords.add(generateTemporaryPassword());
      }
      
      // All should be unique
      expect(passwords.size).toBe(100);
    });
  });

  describe('PASSWORD_REQUIREMENTS', () => {
    it('should have expected properties', () => {
      expect(PASSWORD_REQUIREMENTS.minLength).toBeDefined();
      expect(PASSWORD_REQUIREMENTS.maxLength).toBeDefined();
      expect(PASSWORD_REQUIREMENTS.requireUppercase).toBeDefined();
      expect(PASSWORD_REQUIREMENTS.requireLowercase).toBeDefined();
      expect(PASSWORD_REQUIREMENTS.requireNumber).toBeDefined();
      expect(PASSWORD_REQUIREMENTS.requireSpecial).toBeDefined();
    });

    it('should have reasonable length requirements', () => {
      expect(PASSWORD_REQUIREMENTS.minLength).toBeGreaterThanOrEqual(8);
      expect(PASSWORD_REQUIREMENTS.maxLength).toBeLessThanOrEqual(256);
    });
  });
});
