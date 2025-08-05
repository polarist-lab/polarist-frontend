export const ERROR_CODES = {
  // Domain Errors
  ENTITY_NOT_FOUND: 'ENTITY_NOT_FOUND',
  INVALID_DOMAIN_DATA: 'INVALID_DOMAIN_DATA',
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  DOMAIN_CONFLICT: 'DOMAIN_CONFLICT',
  
  // Application Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  USE_CASE_ERROR: 'USE_CASE_ERROR',
  
  // Infrastructure Errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  FILE_SYSTEM_ERROR: 'FILE_SYSTEM_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  
  // System Errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.ENTITY_NOT_FOUND]: 'The requested resource was not found',
  [ERROR_CODES.INVALID_DOMAIN_DATA]: 'Invalid data provided',
  [ERROR_CODES.BUSINESS_RULE_VIOLATION]: 'Business rule violation occurred',
  [ERROR_CODES.DOMAIN_CONFLICT]: 'Resource conflict detected',
  [ERROR_CODES.VALIDATION_ERROR]: 'Input validation failed',
  [ERROR_CODES.UNAUTHORIZED]: 'Authentication required',
  [ERROR_CODES.FORBIDDEN]: 'Access denied',
  [ERROR_CODES.USE_CASE_ERROR]: 'Use case execution failed',
  [ERROR_CODES.DATABASE_ERROR]: 'Database operation failed',
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'External service unavailable',
  [ERROR_CODES.FILE_SYSTEM_ERROR]: 'File system operation failed',
  [ERROR_CODES.NETWORK_ERROR]: 'Network operation failed',
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred',
} as const;