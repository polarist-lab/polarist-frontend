import { ValidationError } from 'class-validator';
import { ValidationUtil } from '../validation.util';
import { ValidationException } from '../../exceptions/application.exception';

describe('ValidationUtil', () => {
  describe('formatValidationErrors', () => {
    it('should format validation errors correctly', () => {
      const errors: ValidationError[] = [
        {
          property: 'email',
          constraints: {
            isEmail: 'email must be an email',
            isNotEmpty: 'email should not be empty',
          },
        } as ValidationError,
      ];

      const result = ValidationUtil.formatValidationErrors(errors);
      
      expect(result).toEqual({
        email: ['email must be an email', 'email should not be empty'],
      });
    });
  });

  describe('throwValidationException', () => {
    it('should throw ValidationException', () => {
      const errors: ValidationError[] = [
        {
          property: 'name',
          constraints: {
            isString: 'name must be a string',
          },
        } as ValidationError,
      ];

      expect(() => ValidationUtil.throwValidationException(errors))
        .toThrow(ValidationException);
    });
  });
});