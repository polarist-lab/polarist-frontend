import { BaseException } from './base.exception';

export abstract class InfrastructureException extends BaseException {
  abstract readonly code: string;
  abstract readonly statusCode: number;
}

export class DatabaseException extends InfrastructureException {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, originalError: Error) {
    super(`Database ${operation} failed: ${originalError.message}`);
    this.context = { 
      operation, 
      originalError: originalError.message,
      sqlState: (originalError as any).code, 
    };
  }
}

export class ExternalServiceException extends InfrastructureException {
  readonly code = 'EXTERNAL_SERVICE_ERROR';
  readonly statusCode = 502;
  
  constructor(service: string, error: Error, statusCode?: number) {
    super(`External service ${service} failed: ${error.message}`);
    this.context = { 
      service, 
      originalError: error.message,
      externalStatusCode: statusCode 
    };
  }
}

export class FileSystemException extends InfrastructureException {
  readonly code = 'FILE_SYSTEM_ERROR';
  readonly statusCode = 500;
  
  constructor(operation: string, path: string, originalError: Error) {
    super(`File system ${operation} failed for ${path}: ${originalError.message}`);
    this.context = { operation, path, originalError: originalError.message };
  }
}

export class NetworkException extends InfrastructureException {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 502;
  
  constructor(url: string, method: string, originalError: Error) {
    super(`Network ${method} request to ${url} failed: ${originalError.message}`);
    this.context = { url, method, originalError: originalError.message };
  }
}