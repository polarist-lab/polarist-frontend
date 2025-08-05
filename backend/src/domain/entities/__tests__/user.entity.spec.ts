import { User } from '../user.entity';
import { InvalidDomainDataException } from '../../../shared/exceptions/domain.exception';

describe('User', () => {
  const validUserProps = {
    googleId: 'google-123',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
  };

  describe('constructor', () => {
    it('should create user with valid props', () => {
      const user = new User(validUserProps);
      
      expect(user.googleId).toBe('google-123');
      expect(user.email.value).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.avatar).toBe('https://example.com/avatar.jpg');
      expect(user.locale).toBe('en');
    });

    it('should throw error for empty name', () => {
      expect(() => new User({ ...validUserProps, name: '' }))
        .toThrow(InvalidDomainDataException);
    });

    it('should throw error for empty googleId', () => {
      expect(() => new User({ ...validUserProps, googleId: '' }))
        .toThrow(InvalidDomainDataException);
    });
  });

  describe('updateProfile', () => {
    it('should update name and avatar', () => {
      const user = new User(validUserProps);
      user.updateProfile('New Name', 'new-avatar.jpg');
      
      expect(user.name).toBe('New Name');
      expect(user.avatar).toBe('new-avatar.jpg');
    });

    it('should throw error for empty name', () => {
      const user = new User(validUserProps);
      expect(() => user.updateProfile('')).toThrow(InvalidDomainDataException);
    });
  });

  describe('changeLocale', () => {
    it('should change locale to valid value', () => {
      const user = new User(validUserProps);
      user.changeLocale('ko');
      
      expect(user.locale).toBe('ko');
    });

    it('should throw error for invalid locale', () => {
      const user = new User(validUserProps);
      expect(() => user.changeLocale('invalid'))
        .toThrow(InvalidDomainDataException);
    });
  });
});