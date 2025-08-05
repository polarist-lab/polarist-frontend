# DTO 설계 패턴 및 검증 규칙

## 개요
Data Transfer Object (DTO) 설계의 일관된 패턴과 검증 규칙을 정의하여 API 계약의 명확성과 타입 안전성을 보장합니다.

## 기본 원칙

### 1. 단일 책임 원칙
- 각 DTO는 하나의 특정한 목적만 수행
- Request DTO와 Response DTO는 분리

### 2. 불변성
- DTO는 데이터 전송만을 위한 객체
- 비즈니스 로직 포함 금지

### 3. 명시적 검증
- 모든 입력 데이터에 대한 명시적 검증 규칙
- 실패 시 명확한 에러 메시지 제공

## DTO 네이밍 규칙

### Request DTOs
```typescript
// 생성 요청
CreateUserDto
CreateWordbookDto
CreateStudySessionDto

// 업데이트 요청
UpdateUserDto
UpdateWordbookDto
UpdateProgressDto

// 검색/필터 요청
SearchWordbooksDto
FilterProgressDto
GetUserProgressDto

// 액션 요청
MigrateGuestDataDto
ShareWordbookDto
ResetProgressDto
```

### Response DTOs
```typescript
// 단일 엔티티 응답
UserResponseDto
WordbookResponseDto
ProgressResponseDto

// 목록 응답
UserListResponseDto
WordbookListResponseDto
ProgressListResponseDto

// 통계/집계 응답
StudyStatsResponseDto
UserAnalyticsResponseDto
SystemHealthResponseDto
```

## 검증 데코레이터 사용 가이드

### 문자열 검증
```typescript
// 기본 문자열
@IsString()
@IsNotEmpty()
name: string;

// 길이 제한
@IsString()
@MinLength(2)
@MaxLength(100)
name: string;

// 이메일
@IsEmail()
@IsNotEmpty()
email: string;

// URL
@IsUrl()
@IsOptional()
avatar?: string;

// 패턴 매칭
@Matches(/^[a-zA-Z0-9-_]+$/)
@IsString()
shareCode: string;
```

### 숫자 검증
```typescript
// 기본 숫자
@IsNumber()
@Min(1)
@Max(1000)
limit: number;

// 정수
@IsInt()
@Min(0)
attempts: number;

// 부동소수점
@IsNumber({ maxDecimalPlaces: 2 })
@Min(0)
@Max(1)
accuracy: number;
```

### 배열 검증
```typescript
// 문자열 배열
@IsArray()
@ArrayNotEmpty()
@IsString({ each: true })
wordIds: string[];

// 길이 제한
@IsArray()
@ArrayMinSize(1)
@ArrayMaxSize(10)
@IsString({ each: true })
tags: string[];

// 객체 배열
@IsArray()
@ValidateNested({ each: true })
@Type(() => WordProgressDto)
progressList: WordProgressDto[];
```

### 선택적 필드
```typescript
// 기본 선택적 필드
@IsOptional()
@IsString()
description?: string;

// 기본값 설정
@IsOptional()
@IsNumber()
@Min(1)
@Max(100)
limit: number = 20;

// 조건부 검증
@IsOptional()
@ValidateIf(o => o.isPublic === true)
@IsString()
@IsNotEmpty()
shareCode?: string;
```

### Enum 검증
```typescript
enum UserLocale {
  EN = 'en',
  KO = 'ko',
  JA = 'ja',
  ZH = 'zh',
}

@IsOptional()
@IsEnum(UserLocale)
locale?: UserLocale;

// 또는 문자열로
@IsOptional()
@IsIn(['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'])
locale?: string;
```

## DTO 구현 패턴

### 1. 생성 요청 DTO
```typescript
import { 
  IsString, 
  IsNotEmpty, 
  IsEmail, 
  IsOptional, 
  MinLength, 
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  IsIn 
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  googleId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string;

  @IsOptional()
  @IsIn(['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'])
  locale?: string;
}
```

### 2. 업데이트 요청 DTO
```typescript
import { PartialType, OmitType } from '@nestjs/mapped-types';

// 부분 업데이트 (모든 필드 선택적)
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['googleId', 'email'] as const)
) {}

// 또는 명시적 정의
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  avatar?: string;

  @IsOptional()
  @IsIn(['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'])
  locale?: string;
}
```

### 3. 검색/필터 DTO
```typescript
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max, IsString, IsArray } from 'class-validator';

export class SearchWordbooksDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value.split(',').map(tag => tag.trim()))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsIn(['name', 'createdAt', 'studyCount'])
  sortBy?: string = 'createdAt';
}
```

### 4. 응답 DTO
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'google-123', description: 'Google OAuth ID' })
  googleId: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'Avatar URL', required: false })
  avatar?: string;

  @ApiProperty({ example: 'en', description: 'User locale' })
  locale: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: string;

  static fromEntity(user: any): UserResponseDto {
    return {
      id: user.id,
      googleId: user.googleId,
      email: typeof user.email === 'string' ? user.email : user.email.value,
      name: user.name,
      avatar: user.avatar,
      locale: user.locale,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
```

### 5. 페이지네이션 응답 DTO
```typescript
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

export class WordbookListResponseDto extends PaginatedResponseDto<WordbookResponseDto> {
  @ApiProperty({ type: [WordbookResponseDto] })
  items: WordbookResponseDto[];
}
```

## 고급 검증 패턴

### 1. 커스텀 검증 데코레이터
```typescript
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidWordId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidWordId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          // 한글, 영문, 숫자, 하이픈, 언더스코어 허용
          return /^[가-힣a-zA-Z0-9-_\s]+$/.test(value) && value.length > 0 && value.length <= 50;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid word ID (Korean, English, numbers, hyphens, underscores only, 1-50 characters)`;
        },
      },
    });
  };
}

// 사용 예시
export class UpdateWordProgressDto {
  @IsValidWordId()
  wordId: string;

  @IsBoolean()
  isCorrect: boolean;
}
```

### 2. 조건부 검증
```typescript
import { ValidateIf } from 'class-validator';

export class CreateWordbookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isPublic: boolean;

  // isPublic이 true일 때만 shareCode 검증
  @ValidateIf(o => o.isPublic === true)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]{10,30}$/)
  shareCode?: string;

  // isPublic이 false일 때만 description 필수
  @ValidateIf(o => o.isPublic === false)
  @IsString()
  @IsNotEmpty()
  description: string;
}
```

### 3. 네스트된 객체 검증
```typescript
import { ValidateNested, Type } from 'class-transformer';

class WordItemDto {
  @IsString()
  @IsNotEmpty()
  wordId: string;

  @IsString()
  @IsNotEmpty()
  korean: string;

  @IsString()
  @IsNotEmpty()
  english: string;

  @IsOptional()
  @IsString()
  pronunciation?: string;
}

export class CreateBulkWordbookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WordItemDto)
  words: WordItemDto[];
}
```

## 에러 메시지 커스터마이징

### 1. 다국어 지원
```typescript
export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MaxLength(100, { message: 'Name cannot be longer than 100 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
```

### 2. 동적 에러 메시지
```typescript
export class UpdateWordProgressDto {
  @IsString()
  @IsNotEmpty()
  @IsValidWordId({ 
    message: 'Word ID must contain only Korean characters, English letters, numbers, hyphens, and underscores (1-50 characters)' 
  })
  wordId: string;

  @IsBoolean({ 
    message: 'isCorrect must be a boolean value (true or false)' 
  })
  isCorrect: boolean;
}
```

## 테스트 패턴

### 1. DTO 검증 테스트
```typescript
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '../create-user.dto';

describe('CreateUserDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = plainToClass(CreateUserDto, {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      locale: 'en',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = plainToClass(CreateUserDto, {
      googleId: 'google-123',
      email: 'invalid-email',
      name: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints?.isEmail).toBeDefined();
  });

  it('should fail validation with empty required fields', async () => {
    const dto = plainToClass(CreateUserDto, {
      googleId: '',
      email: 'test@example.com',
      name: '',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    
    const googleIdError = errors.find(e => e.property === 'googleId');
    const nameError = errors.find(e => e.property === 'name');
    
    expect(googleIdError).toBeDefined();
    expect(nameError).toBeDefined();
  });

  it('should handle optional fields correctly', async () => {
    const dto = plainToClass(CreateUserDto, {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      // avatar and locale are optional
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
```

### 2. 변환 테스트
```typescript
describe('UserResponseDto', () => {
  it('should convert entity to DTO correctly', () => {
    const mockUser = {
      id: 1,
      googleId: 'google-123',
      email: { value: 'test@example.com' }, // Email value object
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      locale: 'en',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    };

    const dto = UserResponseDto.fromEntity(mockUser);

    expect(dto).toEqual({
      id: 1,
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      locale: 'en',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    });
  });
});
```

## 성능 최적화

### 1. 변환 최적화
```typescript
// 비효율적
export class UserResponseDto {
  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
      // ... 모든 필드를 개별적으로 매핑
    };
  }
}

// 효율적
export class UserResponseDto {
  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    Object.assign(dto, {
      id: user.id,
      email: user.email.value,
      name: user.name,
      avatar: user.avatar,
      locale: user.locale,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
    return dto;
  }
}
```

### 2. 대용량 데이터 처리
```typescript
// 스트리밍 방식으로 큰 목록 처리
export class BulkResponseDto<T> {
  static async* fromEntityStream<E, T>(
    entities: AsyncIterableIterator<E>,
    mapper: (entity: E) => T
  ): AsyncIterableIterator<T> {
    for await (const entity of entities) {
      yield mapper(entity);
    }
  }
}
```

## 문서화 가이드

### 1. OpenAPI 스키마
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
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
  email: string;

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
```

이 가이드를 따라 일관되고 안전한 DTO를 구현하면 API의 품질과 유지보수성이 크게 향상됩니다.