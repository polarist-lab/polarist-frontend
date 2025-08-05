import { BaseException } from './base.exception';

export class ApplicationException extends BaseException {
  readonly code = 'APPLICATION_ERROR';
  readonly statusCode = 500;
}

export class ValidationException extends ApplicationException {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  
  constructor(errors: Record<string, string[]>) {
    super('Input validation failed');
    this.context = { validationErrors: errors };
  }
}

export class UnauthorizedException extends ApplicationException {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;
  
  constructor(reason?: string) {
    super(reason || 'Authentication required');
    this.context = { reason };
  }
}

export class ForbiddenException extends ApplicationException {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;
  
  constructor(resource?: string, action?: string) {
    const message = resource && action 
      ? `Access denied to ${action} ${resource}`
      : 'Access denied';
    super(message);
    this.context = { resource, action };
  }
}

export class UseCaseException extends ApplicationException {
  readonly code = 'USE_CASE_ERROR';
  
  constructor(useCaseName: string, originalError: Error) {
    super(`Use case ${useCaseName} failed: ${originalError.message}`);
    this.context = { 
      useCaseName, 
      originalError: originalError.message,
      stack: originalError.stack 
    };
  }
}

export class ExternalDependencyException extends ApplicationException {
  readonly code = 'EXTERNAL_DEPENDENCY_ERROR';
  readonly statusCode = 503;
  
  constructor(serviceName: string, operation: string, originalError?: Error) {
    super(`External service ${serviceName} failed during ${operation}`);
    this.context = { 
      serviceName, 
      operation,
      originalError: originalError?.message 
    };
  }
}