import { ValidationError } from 'class-validator';
import { ValidationException } from '../exceptions/application.exception';

export class ValidationUtil {
  static formatValidationErrors(errors: ValidationError[]): Record<string, string[]> {
    const formatted: Record<string, string[]> = {};
    
    errors.forEach(error => {
      if (error.constraints) {
        formatted[error.property] = Object.values(error.constraints);
      }
      
      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatValidationErrors(error.children);
        Object.keys(nestedErrors).forEach(key => {
          formatted[`${error.property}.${key}`] = nestedErrors[key];
        });
      }
    });
    
    return formatted;
  }
  
  static throwValidationException(errors: ValidationError[]): never {
    const formatted = this.formatValidationErrors(errors);
    throw new ValidationException(formatted);
  }
}