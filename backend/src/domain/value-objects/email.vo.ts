import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    const trimmedValue = value.toLowerCase().trim();
    if (!this.isValid(trimmedValue)) {
      throw new InvalidDomainDataException('email', value, 'Invalid email format');
    }
    this._value = trimmedValue;
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  static from(value: string): Email {
    return new Email(value);
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  }

  toString(): string {
    return this._value;
  }
}