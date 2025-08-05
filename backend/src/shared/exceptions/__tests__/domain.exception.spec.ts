import { EntityNotFoundDomainException, InvalidDomainDataException } from '../domain.exception';

describe('Domain Exceptions', () => {
  describe('EntityNotFoundDomainException', () => {
    it('should create exception with proper message', () => {
      const exception = new EntityNotFoundDomainException('User', 123);
      
      expect(exception.message).toBe('User with identifier 123 not found');
      expect(exception.code).toBe('ENTITY_NOT_FOUND');
      expect(exception.statusCode).toBe(404);
    });
  });

  describe('InvalidDomainDataException', () => {
    it('should create exception with field info', () => {
      const exception = new InvalidDomainDataException('email', 'invalid-email', 'Invalid format');
      
      expect(exception.message).toBe('Invalid data for field email: invalid-email. Invalid format');
      expect(exception.code).toBe('INVALID_DOMAIN_DATA');
      expect(exception.statusCode).toBe(400);
    });
  });
});