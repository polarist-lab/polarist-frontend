# Phase 3: Application Layer Implementation

## 📋 Phase 개요

**목표**: Use Cases를 구현하고 DTO 시스템을 구축하여 비즈니스 로직을 조합하고 외부 인터페이스를 정의합니다.

**기간**: 2 weeks  
**우선순위**: P0 (최고 우선순위)  
**의존성**: Phase 2 완료 (Domain Layer)

## 🎯 주요 목표

1. **Use Cases 구현**: 비즈니스 시나리오별 유스케이스 구현
2. **DTO 시스템**: 이중 DTO 패턴으로 Domain-API 분리
3. **Input/Output Ports**: 애플리케이션 경계 인터페이스 정의
4. **비즈니스 로직 조합**: Domain 서비스와 엔티티를 활용한 복합 로직

## 📚 관련 PRD 문서

- **주요 참조**: [DTO Validation System PRD](../features/dto-validation-system.md)
- **보조 참조**: 
  - [Clean Architecture Migration PRD](../features/clean-architecture-migration.md)
  - [Swagger Integration PRD](../features/swagger-integration.md)

## 🏗️ 구현 범위

### 1. Use Cases 구현

#### User Management Use Cases

##### CreateUserUseCase
```typescript
// src/application/use-cases/user/create-user.use-case.ts
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // 1. 중복 체크
      await this.validateUniqueness(dto);

      // 2. 도메인 엔티티 생성
      const user = User.create({
        googleId: dto.googleId,
        email: dto.email,
        name: dto.name,
        avatar: dto.avatar,
        locale: dto.locale,
      });

      // 3. 저장
      const savedUser = await this.userRepository.save(user);

      // 4. 응답 DTO 변환
      return UserResponseDto.fromEntity(savedUser);

    } catch (error) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new UseCaseException('CreateUser', error as Error);
    }
  }

  private async validateUniqueness(dto: CreateUserDto): Promise<void> {
    const [existingByGoogleId, existingByEmail] = await Promise.all([
      this.userRepository.findByGoogleId(dto.googleId),
      this.userRepository.findByEmail(Email.from(dto.email)),
    ]);

    if (existingByGoogleId) {
      throw new DomainConflictException('User', 'Google ID already exists');
    }

    if (existingByEmail) {
      throw new DomainConflictException('User', 'Email already in use');
    }
  }
}
```

##### UpdateUserUseCase
```typescript
// src/application/use-cases/user/update-user.use-case.ts
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    try {
      // 1. 사용자 조회
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new EntityNotFoundDomainException('User', userId);
      }

      // 2. 도메인 엔티티 업데이트
      if (dto.name !== undefined || dto.avatar !== undefined) {
        user.updateProfile(
          dto.name ?? user.name,
          dto.avatar ?? user.avatar
        );
      }

      if (dto.locale !== undefined) {
        user.changeLocale(dto.locale);
      }

      // 3. 저장
      const updatedUser = await this.userRepository.update(user);

      // 4. 응답 DTO 변환
      return UserResponseDto.fromEntity(updatedUser);

    } catch (error) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new UseCaseException('UpdateUser', error as Error);
    }
  }
}
```

#### Wordbook Management Use Cases

##### CreateWordbookUseCase
```typescript
// src/application/use-cases/wordbook/create-wordbook.use-case.ts
@Injectable()
export class CreateWordbookUseCase {
  constructor(
    @Inject(WORDBOOK_REPOSITORY)
    private readonly wordbookRepository: WordbookRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number, dto: CreateWordbookDto): Promise<WordbookResponseDto> {
    try {
      // 1. 사용자 존재 확인
      const userExists = await this.userRepository.exists(userId);
      if (!userExists) {
        throw new EntityNotFoundDomainException('User', userId);
      }

      // 2. 도메인 엔티티 생성
      const wordbook = Wordbook.create({
        userId,
        name: dto.name,
        description: dto.description,
        wordIds: dto.wordIds,
        isPublic: dto.isPublic,
        shareCode: dto.shareCode,
      });

      // 3. 공개 설정 처리
      if (dto.isPublic && dto.shareCode) {
        await this.validateShareCodeUniqueness(dto.shareCode);
        wordbook.makePublic(dto.shareCode);
      }

      // 4. 저장
      const savedWordbook = await this.wordbookRepository.save(wordbook);

      // 5. 응답 DTO 변환
      return WordbookResponseDto.fromEntity(savedWordbook);

    } catch (error) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new UseCaseException('CreateWordbook', error as Error);
    }
  }

  private async validateShareCodeUniqueness(shareCode: string): Promise<void> {
    const existing = await this.wordbookRepository.findByShareCode(shareCode);
    if (existing) {
      throw new DomainConflictException('Wordbook', 'Share code already in use');
    }
  }
}
```

### 2. DTO 시스템 구현

#### Domain DTOs (순수 타입)
```typescript
// src/application/dtos/domain/user.dto.ts
export interface CreateUserDto {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale?: string;
}

export interface UpdateUserDto {
  name?: string;
  avatar?: string;
  locale?: string;
}

export interface UserResponseDto {
  id: number;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

// Static factory method를 위한 클래스 버전
export class UserResponseDto {
  constructor(
    public readonly id: number,
    public readonly googleId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly avatar: string | undefined,
    public readonly locale: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromEntity(user: User): UserResponseDto {
    return new UserResponseDto(
      user.id!,
      user.googleId,
      user.email.value,
      user.name,
      user.avatar,
      user.locale,
      user.createdAt,
      user.updatedAt,
    );
  }
}
```

#### API Schema DTOs (검증 포함)
```typescript
// src/application/dtos/api/user.dto.ts
export class CreateUserApiDto {
  @ApiProperty({
    description: 'Google OAuth identifier',
    example: 'google-oauth-123456789',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  googleId: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    maxLength: 255,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  avatar?: string;

  @ApiPropertyOptional({
    description: 'User preferred language',
    example: 'en',
    enum: ['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'],
    default: 'en',
  })
  @IsOptional()
  @IsIn(['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'])
  locale?: string;
}

export class UpdateUserApiDto extends PartialType(
  OmitType(CreateUserApiDto, ['googleId', 'email'] as const)
) {}

export class UserResponseApiDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'google-123', description: 'Google OAuth ID' })
  googleId: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiPropertyOptional({ 
    example: 'https://example.com/avatar.jpg', 
    description: 'Avatar URL' 
  })
  avatar?: string;

  @ApiProperty({ example: 'en', description: 'User locale' })
  locale: string;

  @ApiProperty({ 
    example: '2023-01-01T00:00:00.000Z', 
    description: 'Creation timestamp' 
  })
  createdAt: string;

  @ApiProperty({ 
    example: '2023-01-01T00:00:00.000Z', 
    description: 'Last update timestamp' 
  })
  updatedAt: string;
}
```

#### DTO Mappers
```typescript
// src/application/mappers/user.mapper.ts
export class UserDtoMapper {
  static apiToDomain(apiDto: CreateUserApiDto): CreateUserDto {
    return {
      googleId: apiDto.googleId,
      email: apiDto.email,
      name: apiDto.name,
      avatar: apiDto.avatar,
      locale: apiDto.locale,
    };
  }

  static apiUpdateToDomain(apiDto: UpdateUserApiDto): UpdateUserDto {
    return {
      name: apiDto.name,
      avatar: apiDto.avatar,
      locale: apiDto.locale,
    };
  }

  static domainToApi(domainDto: UserResponseDto): UserResponseApiDto {
    return {
      id: domainDto.id,
      googleId: domainDto.googleId,
      email: domainDto.email,
      name: domainDto.name,
      avatar: domainDto.avatar,
      locale: domainDto.locale,
      createdAt: domainDto.createdAt.toISOString(),
      updatedAt: domainDto.updatedAt.toISOString(),
    };
  }

  static domainListToApi(domainList: UserResponseDto[]): UserResponseApiDto[] {
    return domainList.map(this.domainToApi);
  }
}
```

### 3. 페이지네이션 및 검색 시스템

#### 페이지네이션 DTO
```typescript
// src/application/dtos/common/pagination.dto.ts
export class PaginationQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'List of items' })
  items: T[];

  @ApiProperty({ example: 100, description: 'Total number of items' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 20, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 5, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Has next page' })
  hasNext: boolean;

  @ApiProperty({ example: false, description: 'Has previous page' })
  hasPrev: boolean;

  static create<T>(
    items: T[],
    total: number,
    page: number,
    limit: number
  ): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(total / limit);
    
    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}
```

#### 검색 Use Case
```typescript
// src/application/use-cases/wordbook/search-wordbooks.use-case.ts
@Injectable()
export class SearchWordbooksUseCase {
  constructor(
    @Inject(WORDBOOK_REPOSITORY)
    private readonly wordbookRepository: WordbookRepository,
  ) {}

  async execute(dto: SearchWordbooksDto): Promise<PaginatedResponseDto<WordbookResponseDto>> {
    try {
      const { wordbooks, total } = await this.wordbookRepository.findPublicWordbooks(
        dto.page || 1,
        dto.limit || 20,
        {
          tags: dto.tags,
          category: dto.category,
          search: dto.search,
        }
      );

      const wordbookDtos = wordbooks.map(wb => WordbookResponseDto.fromEntity(wb));

      return PaginatedResponseDto.create(
        wordbookDtos,
        total,
        dto.page || 1,
        dto.limit || 20
      );

    } catch (error) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new UseCaseException('SearchWordbooks', error as Error);
    }
  }
}
```

## ✅ 완료 기준 (Definition of Done)

### 기능적 완료 기준
- [ ] 모든 주요 Use Cases 구현 완료 (CRUD + 비즈니스 로직)
- [ ] 이중 DTO 패턴 완전 적용
- [ ] DTO 매퍼 시스템 구현 완료
- [ ] 페이지네이션 및 검색 기능 구현
- [ ] 입력 검증 시스템 적용

### 품질 완료 기준
- [ ] Use Cases 단위 테스트 완료 (커버리지 90% 이상)
- [ ] DTO 검증 테스트 완료
- [ ] 매퍼 변환 테스트 완료
- [ ] 에러 시나리오 테스트 완료

### 아키텍처 완료 기준
- [ ] Application Layer가 Domain Layer만 의존
- [ ] Use Cases가 외부 의존성을 인터페이스를 통해 사용
- [ ] DTO가 계층간 데이터 전송 역할만 수행
- [ ] 비즈니스 로직이 Use Cases에 적절히 조합

## 🧪 테스트 계획

### Use Case 테스트
```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserDomainService: jest.Mocked<UserDomainService>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    mockUserDomainService = createMockUserDomainService();
    useCase = new CreateUserUseCase(mockUserRepository, mockUserDomainService);
  });

  it('should create user successfully', async () => {
    // Arrange
    mockUserRepository.findByGoogleId.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(createSavedUser());

    const dto: CreateUserDto = {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      locale: 'en',
    };

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result).toMatchObject({
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      locale: 'en',
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        googleId: 'google-123',
        name: 'Test User',
      })
    );
  });

  it('should throw conflict exception for duplicate Google ID', async () => {
    // Arrange
    mockUserRepository.findByGoogleId.mockResolvedValue(createExistingUser());
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const dto: CreateUserDto = {
      googleId: 'existing-google-id',
      email: 'new@example.com',
      name: 'New User',
    };

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow(DomainConflictException);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });
});
```

### DTO 검증 테스트
```typescript
describe('CreateUserApiDto Validation', () => {
  it('should pass with valid data', async () => {
    const dto = plainToClass(CreateUserApiDto, {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      locale: 'en',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail with invalid email', async () => {
    const dto = plainToClass(CreateUserApiDto, {
      googleId: 'google-123',
      email: 'invalid-email',
      name: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail with too long name', async () => {
    const dto = plainToClass(CreateUserApiDto, {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'a'.repeat(101), // 100자 초과
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });
});
```

### 매퍼 테스트
```typescript
describe('UserDtoMapper', () => {
  it('should map API DTO to Domain DTO correctly', () => {
    const apiDto: CreateUserApiDto = {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      locale: 'ko',
    };

    const domainDto = UserDtoMapper.apiToDomain(apiDto);

    expect(domainDto).toEqual({
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      locale: 'ko',
    });
  });

  it('should map Domain response to API response correctly', () => {
    const domainDto: UserResponseDto = {
      id: 1,
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      locale: 'ko',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    };

    const apiDto = UserDtoMapper.domainToApi(domainDto);

    expect(apiDto).toEqual({
      id: 1,
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      locale: 'ko',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });
});
```

## 📊 성공 지표

### 정량적 지표
- **Use Cases 완성도**: 모든 주요 비즈니스 시나리오 구현
- **DTO 커버리지**: 100% API 입출력 DTO 적용
- **테스트 커버리지**: Application Layer 90% 이상
- **검증 규칙**: 100% 입력 데이터 검증 적용

### 정성적 지표
- **비즈니스 로직 명확성**: Use Cases가 비즈니스 요구사항을 명확히 반영
- **계층 분리**: Application Layer가 적절한 책임만 담당
- **타입 안전성**: 컴파일 타임에 타입 오류 검출

## 🔄 다음 단계 준비

### Phase 4 준비사항
- [ ] Repository 구현체 설계 문서 검토
- [ ] 데이터베이스 스키마 마이그레이션 계획
- [ ] 외부 서비스 어댑터 인터페이스 정의

### 전달 사항
- Use Cases 사용법 가이드
- DTO 변환 패턴 가이드라인
- 검증 규칙 확장 방법

## 🔗 관련 문서

### 상세 기술 문서
- [DTO Patterns Implementation Guide](../../docs/dto-patterns.md)
- [Phase 3 Implementation Guide](../../docs/phase-3-application.md)

### 이전/다음 Phase 문서
- [Phase 2: Domain Layer](./phase-2-domain.md)
- [Phase 4: Infrastructure Layer](./phase-4-infrastructure.md)

---

**Phase Owner**: Senior Backend Developer  
**Reviewers**: System Architect, Product Owner  
**최종 업데이트**: 2024년 8월