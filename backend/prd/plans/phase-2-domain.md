# Phase 2: Domain Layer Implementation

## 📋 Phase 개요

**목표**: 비즈니스 도메인의 핵심 엔티티, 값 객체, 도메인 서비스를 구현하여 Clean Architecture의 Domain Layer를 완성합니다.

**기간**: 1 week  
**우선순위**: P0 (최고 우선순위)  
**의존성**: Phase 1 완료 (Foundation Setup)

## 🎯 주요 목표

1. **Domain Entities**: 비즈니스 엔티티 구현 (User, Wordbook, Progress)
2. **Value Objects**: 도메인 특화 값 객체 구현 (Email, WordId)
3. **Repository Interfaces**: 데이터 액세스 추상화 인터페이스 정의
4. **Domain Services**: 복잡한 비즈니스 로직 캡슐화

## 📚 관련 PRD 문서

- **주요 참조**: [Clean Architecture Migration PRD](../features/clean-architecture-migration.md)
- **보조 참조**: [DTO Validation System PRD](../features/dto-validation-system.md)

## 🏗️ 구현 범위

### 1. Domain Entities 구현

#### User Entity
```typescript
// src/domain/entities/user.entity.ts
export class User {
  constructor(
    private readonly _id: number | null,
    private readonly _googleId: string,
    private _email: Email,
    private _name: string,
    private _avatar?: string,
    private _locale: string = 'en',
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {}

  get id(): number | null { return this._id; }
  get googleId(): string { return this._googleId; }
  get email(): Email { return this._email; }
  get name(): string { return this._name; }
  get avatar(): string | undefined { return this._avatar; }
  get locale(): string { return this._locale; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  updateProfile(name: string, avatar?: string): void {
    this.validateName(name);
    this._name = name;
    this._avatar = avatar;
    this._updatedAt = new Date();
  }

  changeLocale(locale: string): void {
    this.validateLocale(locale);
    this._locale = locale;
    this._updatedAt = new Date();
  }

  static create(props: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
    locale?: string;
  }): User {
    return new User(
      null, // 새로운 엔티티는 ID가 없음
      props.googleId,
      Email.from(props.email),
      props.name,
      props.avatar,
      props.locale || 'en'
    );
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidDomainDataException('name', name, 'Name cannot be empty');
    }
    if (name.length > 100) {
      throw new InvalidDomainDataException('name', name, 'Name cannot exceed 100 characters');
    }
  }

  private validateLocale(locale: string): void {
    const validLocales = ['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'];
    if (!validLocales.includes(locale)) {
      throw new InvalidDomainDataException('locale', locale, 'Invalid locale');
    }
  }
}
```

#### Wordbook Entity
```typescript
// src/domain/entities/wordbook.entity.ts
export class Wordbook {
  constructor(
    private readonly _id: number | null,
    private readonly _userId: number,
    private _name: string,
    private _description: string,
    private _wordIds: WordId[],
    private _isPublic: boolean = false,
    private _shareCode?: string,
    private readonly _createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {}

  // Getters
  get id(): number | null { return this._id; }
  get userId(): number { return this._userId; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get wordIds(): WordId[] { return [...this._wordIds]; }
  get totalWords(): number { return this._wordIds.length; }
  get isPublic(): boolean { return this._isPublic; }
  get shareCode(): string | undefined { return this._shareCode; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  updateInfo(name: string, description: string): void {
    this.validateName(name);
    this._name = name;
    this._description = description;
    this._updatedAt = new Date();
  }

  addWord(wordId: WordId): void {
    if (this._wordIds.some(w => w.equals(wordId))) {
      throw new BusinessRuleViolationException(
        'Word already exists in wordbook',
        { wordId: wordId.value }
      );
    }
    this._wordIds.push(wordId);
    this._updatedAt = new Date();
  }

  removeWord(wordId: WordId): void {
    const index = this._wordIds.findIndex(w => w.equals(wordId));
    if (index === -1) {
      throw new EntityNotFoundDomainException('Word', wordId.value);
    }
    this._wordIds.splice(index, 1);
    this._updatedAt = new Date();
  }

  makePublic(shareCode: string): void {
    this.validateShareCode(shareCode);
    this._isPublic = true;
    this._shareCode = shareCode;
    this._updatedAt = new Date();
  }

  makePrivate(): void {
    this._isPublic = false;
    this._shareCode = undefined;
    this._updatedAt = new Date();
  }

  static create(props: {
    userId: number;
    name: string;
    description: string;
    wordIds?: string[];
    isPublic?: boolean;
    shareCode?: string;
  }): Wordbook {
    const wordIds = (props.wordIds || []).map(id => WordId.from(id));
    
    return new Wordbook(
      null,
      props.userId,
      props.name,
      props.description,
      wordIds,
      props.isPublic || false,
      props.shareCode
    );
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new InvalidDomainDataException('name', name, 'Wordbook name cannot be empty');
    }
    if (name.length > 200) {
      throw new InvalidDomainDataException('name', name, 'Name cannot exceed 200 characters');
    }
  }

  private validateShareCode(shareCode: string): void {
    if (!shareCode || !/^[a-zA-Z0-9]{10,30}$/.test(shareCode)) {
      throw new InvalidDomainDataException(
        'shareCode', 
        shareCode, 
        'Share code must be 10-30 alphanumeric characters'
      );
    }
  }
}
```

### 2. Value Objects 구현

#### Email Value Object
```typescript
// src/domain/value-objects/email.vo.ts
export class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidDomainDataException('email', value, 'Invalid email format');
    }
    this._value = value.toLowerCase().trim();
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
```

#### WordId Value Object
```typescript
// src/domain/value-objects/word-id.vo.ts
export class WordId {
  private readonly _value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidDomainDataException(
        'wordId',
        value,
        'Word ID must contain only Korean, English, numbers, hyphens, underscores (1-50 characters)'
      );
    }
    this._value = value.trim();
  }

  get value(): string {
    return this._value;
  }

  equals(other: WordId): boolean {
    return this._value === other._value;
  }

  static from(value: string): WordId {
    return new WordId(value);
  }

  private isValid(wordId: string): boolean {
    if (!wordId || typeof wordId !== 'string') return false;
    
    // 한글, 영문, 숫자, 하이픈, 언더스코어, 공백 허용
    const pattern = /^[가-힣a-zA-Z0-9-_\s]+$/;
    return pattern.test(wordId) && wordId.length > 0 && wordId.length <= 50;
  }

  toString(): string {
    return this._value;
  }
}
```

### 3. Repository Interfaces 정의

#### User Repository Interface
```typescript
// src/domain/repositories/user.repository.interface.ts
export interface UserRepository {
  findById(id: number): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
  
  // 집계 쿼리
  findActiveUsers(limit?: number): Promise<User[]>;
  countByLocale(locale: string): Promise<number>;
  findUsersCreatedAfter(date: Date): Promise<User[]>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
```

#### Wordbook Repository Interface
```typescript
// src/domain/repositories/wordbook.repository.interface.ts
export interface WordbookRepository {
  findById(id: number): Promise<Wordbook | null>;
  findByUserId(userId: number): Promise<Wordbook[]>;
  findByShareCode(shareCode: string): Promise<Wordbook | null>;
  save(wordbook: Wordbook): Promise<Wordbook>;
  update(wordbook: Wordbook): Promise<Wordbook>;
  delete(id: number): Promise<void>;
  
  // 검색 및 필터링
  findPublicWordbooks(
    page: number,
    limit: number,
    filters?: {
      tags?: string[];
      category?: string;
      search?: string;
    }
  ): Promise<{ wordbooks: Wordbook[]; total: number }>;
  
  findPopularWordbooks(limit: number): Promise<Wordbook[]>;
}

export const WORDBOOK_REPOSITORY = Symbol('WORDBOOK_REPOSITORY');
```

### 4. Domain Services 구현

#### User Domain Service
```typescript
// src/domain/services/user.domain-service.ts
@Injectable()
export class UserDomainService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async isEmailUnique(email: Email, excludeUserId?: number): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (!existingUser) return true;
    if (excludeUserId && existingUser.id === excludeUserId) return true;
    
    return false;
  }

  async isGoogleIdUnique(googleId: string, excludeUserId?: number): Promise<boolean> {
    const existingUser = await this.userRepository.findByGoogleId(googleId);
    
    if (!existingUser) return true;
    if (excludeUserId && existingUser.id === excludeUserId) return true;
    
    return false;
  }

  async validateUserUniqueness(user: User): Promise<void> {
    const [emailUnique, googleIdUnique] = await Promise.all([
      this.isEmailUnique(user.email, user.id || undefined),
      this.isGoogleIdUnique(user.googleId, user.id || undefined),
    ]);

    if (!emailUnique) {
      throw new DomainConflictException('User', 'Email already in use');
    }

    if (!googleIdUnique) {
      throw new DomainConflictException('User', 'Google ID already in use');
    }
  }
}
```

## ✅ 완료 기준 (Definition of Done)

### 기능적 완료 기준
- [ ] User, Wordbook, Progress 엔티티 구현 완료
- [ ] Email, WordId 값 객체 구현 완료
- [ ] 모든 Repository 인터페이스 정의 완료
- [ ] Domain Service 구현 완료
- [ ] 비즈니스 규칙 검증 로직 구현 완료

### 품질 완료 기준
- [ ] 모든 도메인 로직 단위 테스트 완료 (커버리지 95% 이상)
- [ ] 비즈니스 규칙 위반 시 적절한 예외 발생
- [ ] 불변성 원칙 준수 (엔티티 상태 변경은 메서드를 통해서만)
- [ ] 외부 의존성 없음 (Framework-agnostic)

### 설계 완료 기준
- [ ] 단일 책임 원칙 준수
- [ ] 도메인 전문가와 용어 일치 (Ubiquitous Language)
- [ ] 엔티티와 값 객체의 명확한 구분
- [ ] Repository 인터페이스 추상화 적절성

## 🧪 테스트 계획

### Domain Entity 테스트
```typescript
describe('User Entity', () => {
  describe('creation', () => {
    it('should create user with valid data', () => {
      const user = User.create({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        locale: 'en'
      });

      expect(user.googleId).toBe('google-123');
      expect(user.email.value).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.locale).toBe('en');
    });

    it('should throw error for invalid email', () => {
      expect(() => User.create({
        googleId: 'google-123',
        email: 'invalid-email',
        name: 'Test User'
      })).toThrow(InvalidDomainDataException);
    });
  });

  describe('profile update', () => {
    it('should update profile with valid data', () => {
      const user = User.create({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User'
      });

      user.updateProfile('Updated Name', 'new-avatar.jpg');

      expect(user.name).toBe('Updated Name');
      expect(user.avatar).toBe('new-avatar.jpg');
    });

    it('should reject empty name', () => {
      const user = User.create({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User'
      });

      expect(() => user.updateProfile('')).toThrow(InvalidDomainDataException);
    });
  });
});
```

### Value Object 테스트
```typescript
describe('Email Value Object', () => {
  it('should create valid email', () => {
    const email = Email.from('test@example.com');
    expect(email.value).toBe('test@example.com');
  });

  it('should normalize email case', () => {
    const email = Email.from('Test@EXAMPLE.COM');
    expect(email.value).toBe('test@example.com');
  });

  it('should reject invalid email format', () => {
    expect(() => Email.from('invalid-email')).toThrow(InvalidDomainDataException);
  });

  it('should compare emails correctly', () => {
    const email1 = Email.from('test@example.com');
    const email2 = Email.from('TEST@example.com');
    
    expect(email1.equals(email2)).toBe(true);
  });
});
```

### Domain Service 테스트
```typescript
describe('UserDomainService', () => {
  let service: UserDomainService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    service = new UserDomainService(mockUserRepository);
  });

  describe('validateUserUniqueness', () => {
    it('should pass for unique user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByGoogleId.mockResolvedValue(null);

      const user = User.create({
        googleId: 'unique-123',
        email: 'unique@example.com',
        name: 'Unique User'
      });

      await expect(service.validateUserUniqueness(user)).resolves.not.toThrow();
    });

    it('should throw for duplicate email', async () => {
      const existingUser = User.create({
        googleId: 'existing-123',
        email: 'existing@example.com',
        name: 'Existing User'
      });

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      mockUserRepository.findByGoogleId.mockResolvedValue(null);

      const newUser = User.create({
        googleId: 'new-123',
        email: 'existing@example.com',
        name: 'New User'
      });

      await expect(service.validateUserUniqueness(newUser))
        .rejects.toThrow(DomainConflictException);
    });
  });
});
```

## 📊 성공 지표

### 정량적 지표
- **엔티티 완성도**: 모든 주요 엔티티 구현 (User, Wordbook, Progress)
- **테스트 커버리지**: Domain Layer 95% 이상
- **순환 의존성**: 0개 (도메인은 외부에 의존하지 않음)
- **비즈니스 규칙**: 100% 검증 로직 구현

### 정성적 지표
- **도메인 모델 완성도**: 비즈니스 요구사항 반영 정도
- **코드 품질**: Clean Code 원칙 준수
- **도메인 전문가 승인**: 비즈니스 로직 정확성 검증

## 🔄 다음 단계 준비

### Phase 3 준비사항
- [ ] Use Cases 목록 및 우선순위 정리
- [ ] DTO 설계 문서 작성
- [ ] Application Service 인터페이스 설계

### 전달 사항
- Domain entities 사용법 가이드
- Repository 인터페이스 구현 가이드라인
- 비즈니스 규칙 검증 패턴

## 🔗 관련 문서

### 상세 기술 문서
- [Clean Architecture Plan - Domain Layer](../../docs/clean-architecture-plan.md#domain-layer)
- [Phase 2 Implementation Guide](../../docs/phase-2-domain.md)

### 이전/다음 Phase 문서
- [Phase 1: Foundation](./phase-1-foundation.md)
- [Phase 3: Application Layer](./phase-3-application.md)

---

**Phase Owner**: Senior Backend Developer  
**Reviewers**: System Architect, Domain Expert  
**최종 업데이트**: 2024년 8월