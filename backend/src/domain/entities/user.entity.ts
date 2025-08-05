import { Email } from '../value-objects/email.vo';
import { InvalidDomainDataException } from '../../shared/exceptions/domain.exception';

export interface UserProps {
  id?: number;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private _id?: number;
  private _googleId: string;
  private _email: Email;
  private _name: string;
  private _avatar?: string;
  private _locale: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this.validateProps(props);
    
    this._id = props.id;
    this._googleId = props.googleId;
    this._email = Email.from(props.email);
    this._name = props.name;
    this._avatar = props.avatar;
    this._locale = props.locale || 'en';
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get googleId(): string {
    return this._googleId;
  }

  get email(): Email {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get avatar(): string | undefined {
    return this._avatar;
  }

  get locale(): string {
    return this._locale;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  updateProfile(name: string, avatar?: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidDomainDataException('name', name, 'Name cannot be empty');
    }
    
    this._name = name.trim();
    if (avatar !== undefined) {
      this._avatar = avatar;
    }
    this._updatedAt = new Date();
  }

  changeLocale(locale: string): void {
    const validLocales = ['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'];
    if (!validLocales.includes(locale)) {
      throw new InvalidDomainDataException('locale', locale, 'Invalid locale');
    }
    
    this._locale = locale;
    this._updatedAt = new Date();
  }

  setId(id: number): void {
    if (this._id !== undefined) {
      throw new InvalidDomainDataException('id', id, 'ID already set');
    }
    this._id = id;
  }

  equals(other: User): boolean {
    return this._googleId === other._googleId;
  }

  private validateProps(props: UserProps): void {
    if (!props.googleId || props.googleId.trim().length === 0) {
      throw new InvalidDomainDataException('googleId', props.googleId, 'Google ID is required');
    }
    
    if (!props.name || props.name.trim().length === 0) {
      throw new InvalidDomainDataException('name', props.name, 'Name is required');
    }
    
    if (props.name.length > 100) {
      throw new InvalidDomainDataException('name', props.name, 'Name too long');
    }
  }

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    return new User(props);
  }
}