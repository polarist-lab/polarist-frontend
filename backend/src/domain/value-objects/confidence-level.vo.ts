import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export class ConfidenceLevel {
  private readonly _value: number;

  constructor(value: number) {
    if (!this.isValid(value)) {
      throw new InvalidDomainDataException(
        'confidenceLevel', 
        value, 
        'Confidence level must be between 0 and 5'
      );
    }
    this._value = Math.floor(value);
  }

  get value(): number {
    return this._value;
  }

  isLowConfidence(): boolean {
    return this._value <= 2;
  }

  isHighConfidence(): boolean {
    return this._value >= 4;
  }

  increment(): ConfidenceLevel {
    return new ConfidenceLevel(Math.min(5, this._value + 1));
  }

  decrement(): ConfidenceLevel {
    return new ConfidenceLevel(Math.max(0, this._value - 1));
  }

  equals(other: ConfidenceLevel): boolean {
    return this._value === other._value;
  }

  private isValid(value: number): boolean {
    return Number.isInteger(value) && value >= 0 && value <= 5;
  }

  static from(value: number): ConfidenceLevel {
    return new ConfidenceLevel(value);
  }

  static lowest(): ConfidenceLevel {
    return new ConfidenceLevel(0);
  }

  static highest(): ConfidenceLevel {
    return new ConfidenceLevel(5);
  }
}