import { Email } from '../email.vo';
import { InvalidDomainDataException } from '../../../shared/exceptions/domain.exception';

describe('Email', () => {
  describe('constructor', () => {
    it('should create valid email', () => {
      const email = new Email('test@example.com');
      expect(email.value).toBe('test@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = new Email('Test@Example.COM');
      expect(email.value).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const email = new Email('  test@example.com  ');
      expect(email.value).toBe('test@example.com');
    });

    it('should throw error for invalid email', () => {
      expect(() => new Email('invalid-email')).toThrow(InvalidDomainDataException);
    });

    it('should throw error for empty email', () => {
      expect(() => new Email('')).toThrow(InvalidDomainDataException);
    });
  });

  describe('equals', () => {
    it('should return true for same email', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });
});