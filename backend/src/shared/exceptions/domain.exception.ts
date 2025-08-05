import { BaseException } from './base.exception';

export abstract class DomainException extends BaseException {
  abstract readonly code: string;
  abstract readonly statusCode: number;
}

export class EntityNotFoundDomainException extends DomainException {
  readonly code = 'ENTITY_NOT_FOUND';
  readonly statusCode = 404;
  
  constructor(entityName: string, identifier: string | number) {
    super(`${entityName} with identifier ${identifier} not found`);
    this.context = { entityName, identifier };
  }
}

export class InvalidDomainDataException extends DomainException {
  readonly code = 'INVALID_DOMAIN_DATA';
  readonly statusCode = 400;
  
  constructor(fieldName: string, value: any, reason?: string) {
    const message = `Invalid data for field ${fieldName}: ${value}${reason ? `. ${reason}` : ''}`;
    super(message);
    this.context = { fieldName, value, reason };
  }
}

export class BusinessRuleViolationException extends DomainException {
  readonly code = 'BUSINESS_RULE_VIOLATION';
  readonly statusCode = 400;
  
  constructor(rule: string, details?: Record<string, any>) {
    super(`Business rule violation: ${rule}`);
    this.context = { rule, ...details };
  }
}

export class DomainConflictException extends DomainException {
  readonly code = 'DOMAIN_CONFLICT';
  readonly statusCode = 409;
  
  constructor(resource: string, conflictReason: string) {
    super(`Conflict in ${resource}: ${conflictReason}`);
    this.context = { resource, conflictReason };
  }
}