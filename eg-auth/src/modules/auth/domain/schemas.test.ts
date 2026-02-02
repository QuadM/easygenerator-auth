import { describe, it, expect } from 'vitest';
import { signupSchema, signinSchema } from './schemas';

describe('Auth Schemas', () => {
  describe('signupSchema', () => {
    it('should validate correct signup data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password@123',
        username: 'testuser',
      };

      const result = signupSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      expect(() => signupSchema.parse(invalidData)).toThrow();
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
        name: 'Test User',
      };

      expect(() => signupSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty username', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password@123',
        username: '',
      };

      expect(() => signupSchema.parse(invalidData)).toThrow();
    });
  });

  describe('signinSchema', () => {
    it('should validate correct signin data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password@123',
      };

      const result = signinSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password',
      };

      expect(() => signinSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      expect(() => signinSchema.parse(invalidData)).toThrow();
    });
  });
});
