import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export class WordId {
  private readonly _value: string;

  constructor(value: string | number) {
    const stringValue = String(value).trim();
    if (!this.isValid(stringValue)) {
      throw new InvalidDomainDataException('wordId', value, 'Word ID must be non-empty string');
    }
    this._value = stringValue;
  }

  get value(): string {
    return this._value;
  }

  equals(other: WordId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  private isValid(value: string): boolean {
    return value.length > 0 && value.length <= 100;
  }

  static from(value: string | number): WordId {
    return new WordId(value);
  }
}