# Phase 3: Application Layer (애플리케이션 계층)

## 목표
Use Case와 DTO를 구현하여 비즈니스 로직을 조합하고, API 계약을 명확히 정의합니다.

## 범위
- 모든 API에 대한 요청/응답 DTO 정의
- Use Case 클래스 구현 (비즈니스 로직 조합)
- Application Service 리팩토링
- 입력 검증 로직 통합

## 구현할 파일 목록

### 1. Auth DTOs (`src/application/dtos/auth/`)

#### `google-login.dto.ts`
```typescript
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsIn } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsIn(['signup', 'login'])
  intent?: 'signup' | 'login';
}

export class MigrateGuestDataDto {
  @IsString()
  @IsNotEmpty()
  guestId: string;
}
```

#### `auth-response.dto.ts`
```typescript
import { UserResponseDto } from '../users/user-response.dto';

export class AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
  isNewUser?: boolean;
  guestDataMigrated?: boolean;
}

export class AuthErrorResponseDto {
  reason: 'account_exists' | 'account_not_found' | 'signup_failed' | 'login_failed';
  message: string;
}
```

### 2. User DTOs (`src/application/dtos/users/`)

#### `create-user.dto.ts`
```typescript
import { 
  IsString, 
  IsNotEmpty, 
  IsEmail, 
  IsOptional, 
  MinLength, 
  MaxLength,
  IsIn 
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
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
  avatar?: string;

  @IsOptional()
  @IsIn(['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'])
  locale?: string;
}
```

#### `update-user.dto.ts`
```typescript
import { 
  IsString, 
  IsOptional, 
  MinLength, 
  MaxLength,
  IsIn 
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsIn(['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'])
  locale?: string;
}
```

#### `user-response.dto.ts`
```typescript
export class UserResponseDto {
  id: number;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale: string;
  createdAt: string;
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

### 3. Progress DTOs (`src/application/dtos/progress/`)

#### `word-progress.dto.ts`
```typescript
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateWordProgressDto {
  @IsString()
  @IsNotEmpty()
  wordId: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class WordProgressResponseDto {
  wordId: string;
  isLearned: boolean;
  attempts: number;
  correctAnswers: number;
  confidence: number;
  accuracy: number;
  lastStudied?: string;
  isReadyForReview: boolean;

  static fromEntity(progress: any): WordProgressResponseDto {
    const accuracy = progress.attempts > 0 ? progress.correctAnswers / progress.attempts : 0;
    
    return {
      wordId: typeof progress.wordId === 'string' ? progress.wordId : progress.wordId.value,
      isLearned: progress.isLearned,
      attempts: progress.attempts,
      correctAnswers: progress.correctAnswers,
      confidence: typeof progress.confidence === 'number' ? progress.confidence : progress.confidence.value,
      accuracy: Math.round(accuracy * 100) / 100,
      lastStudied: progress.lastStudied?.toISOString(),
      isReadyForReview: progress.isReadyForReview ? progress.isReadyForReview() : false,
    };
  }
}

export class ResetWordProgressDto {
  @IsString()
  @IsNotEmpty()
  wordId: string;
}
```

#### `study-session.dto.ts`
```typescript
import { IsOptional, IsObject, IsNumber, Min } from 'class-validator';

export class StartStudySessionDto {
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class EndStudySessionDto {
  @IsNumber()
  @Min(0)
  duration: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class StudySessionResponseDto {
  id?: number;
  sessionId: string;
  userId: number;
  wordsStudied: number;
  correctAnswers: number;
  totalAttempts: number;
  accuracy: number;
  duration?: number;
  durationInMinutes: number;
  metadata?: Record<string, any>;
  isActive: boolean;
  startTime: string;
  endTime?: string;
  createdAt: string;

  static fromEntity(session: any): StudySessionResponseDto {
    return {
      id: session.id,
      sessionId: session.sessionId,
      userId: session.userId,
      wordsStudied: session.wordsStudied,
      correctAnswers: session.correctAnswers,
      totalAttempts: session.totalAttempts,
      accuracy: session.getAccuracy ? session.getAccuracy() : 0,
      duration: session.duration,
      durationInMinutes: session.getDurationInMinutes ? session.getDurationInMinutes() : 0,
      metadata: session.metadata,
      isActive: session.isActive ? session.isActive() : false,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime?.toISOString(),
      createdAt: session.createdAt.toISOString(),
    };
  }
}
```

#### `study-stats.dto.ts`
```typescript
export class StudyStatsResponseDto {
  totalWordsStudied: number;
  totalSessions: number;
  averageAccuracy: number;
  totalStudyTime: number;
  totalStudyTimeInHours: number;
  streak: number;
  learnedWordsCount: number;
  confidenceDistribution: Record<number, number>;
  weeklyProgress: Array<{
    date: string;
    wordsStudied: number;
    accuracy: number;
  }>;

  static fromData(stats: any, progressList?: any[]): StudyStatsResponseDto {
    const confidenceDistribution = progressList 
      ? this.calculateConfidenceDistribution(progressList)
      : { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    return {
      totalWordsStudied: stats.totalWordsStudied || 0,
      totalSessions: stats.totalSessions || 0,
      averageAccuracy: Math.round((stats.averageAccuracy || 0) * 100) / 100,
      totalStudyTime: stats.totalStudyTime || 0,
      totalStudyTimeInHours: Math.round((stats.totalStudyTime || 0) / 3600 * 100) / 100,
      streak: stats.streak || 0,
      learnedWordsCount: progressList ? progressList.filter(p => p.isLearned).length : 0,
      confidenceDistribution,
      weeklyProgress: [], // TODO: Implement weekly progress calculation
    };
  }

  private static calculateConfidenceDistribution(progressList: any[]): Record<number, number> {
    const distribution: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    progressList.forEach(progress => {
      const level = typeof progress.confidence === 'number' 
        ? progress.confidence 
        : progress.confidence.value;
      distribution[level]++;
    });
    
    return distribution;
  }
}
```

### 4. Wordbook DTOs (`src/application/dtos/wordbooks/`)

#### `create-wordbook.dto.ts`
```typescript
import { 
  IsString, 
  IsNotEmpty, 
  IsArray, 
  IsOptional, 
  IsBoolean,
  ArrayNotEmpty,
  MaxLength,
  ArrayMaxSize 
} from 'class-validator';

export class CreateWordbookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  wordIds: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(3)
  difficulties?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
```

#### `update-wordbook.dto.ts`
```typescript
import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsBoolean,
  ArrayNotEmpty,
  MaxLength,
  ArrayMaxSize 
} from 'class-validator';

export class UpdateWordbookDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  wordIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(3)
  difficulties?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class ShareWordbookDto {
  @IsBoolean()
  enableSharing: boolean;
}
```

#### `wordbook-response.dto.ts`
```typescript
export class WordbookResponseDto {
  id?: number;
  userId: number;
  name: string;
  description?: string;
  wordIds: string[];
  categories: string[];
  difficulties: string[];
  tags: string[];
  isPublic: boolean;
  isShared: boolean;
  shareCode?: string;
  totalWords: number;
  studyCount: number;
  canEdit: boolean;
  createdAt: string;
  updatedAt: string;

  static fromEntity(wordbook: any, currentUserId?: number): WordbookResponseDto {
    return {
      id: wordbook.id,
      userId: wordbook.userId,
      name: wordbook.name,
      description: wordbook.description,
      wordIds: Array.isArray(wordbook.wordIds) ? wordbook.wordIds : [],
      categories: Array.isArray(wordbook.categories) ? wordbook.categories : [],
      difficulties: Array.isArray(wordbook.difficulties) ? wordbook.difficulties : [],
      tags: Array.isArray(wordbook.tags) ? wordbook.tags : [],
      isPublic: wordbook.isPublic,
      isShared: wordbook.isShared,
      shareCode: wordbook.shareCode,
      totalWords: wordbook.totalWords,
      studyCount: wordbook.studyCount,
      canEdit: currentUserId ? wordbook.isOwnedBy(currentUserId) : false,
      createdAt: wordbook.createdAt.toISOString(),
      updatedAt: wordbook.updatedAt.toISOString(),
    };
  }
}

export class WordbookListResponseDto {
  wordbooks: WordbookResponseDto[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;

  static fromPaginatedData(
    wordbooks: any[], 
    total: number, 
    page: number, 
    limit: number,
    currentUserId?: number
  ): WordbookListResponseDto {
    return {
      wordbooks: wordbooks.map(wb => WordbookResponseDto.fromEntity(wb, currentUserId)),
      total,
      page,
      limit,
      hasNext: (page * limit) < total,
      hasPrev: page > 1,
    };
  }
}
```

### 5. Use Cases (`src/application/use-cases/`)

#### Auth Use Cases (`src/application/use-cases/auth/`)

##### `google-signup.use-case.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { GoogleLoginDto } from '../../dtos/auth/google-login.dto';
import { AuthResponseDto } from '../../dtos/auth/auth-response.dto';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { ApplicationException } from '../../../shared/exceptions/application.exception';
import { JwtService } from '@nestjs/jwt';
import { Email } from '../../../domain/value-objects/email.vo';

@Injectable()
export class GoogleSignupUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: GoogleLoginDto, guestId?: string): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByGoogleId(dto.googleId);
    if (existingUser) {
      throw new ApplicationException('Account already exists');
    }

    // Check if email is already in use
    const emailVo = Email.from(dto.email);
    const existingEmailUser = await this.userRepository.findByEmail(emailVo);
    if (existingEmailUser) {
      throw new ApplicationException('Email already in use');
    }

    // Create new user
    const user = User.create({
      googleId: dto.googleId,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = { sub: savedUser.id, email: savedUser.email.value };
    const accessToken = this.jwtService.sign(payload);

    // TODO: Migrate guest data if guestId provided
    let guestDataMigrated = false;
    if (guestId) {
      guestDataMigrated = await this.migrateGuestData(savedUser.id!, guestId);
    }

    return {
      user: UserResponseDto.fromEntity(savedUser),
      accessToken,
      isNewUser: true,
      guestDataMigrated,
    };
  }

  private async migrateGuestData(userId: number, guestId: string): Promise<boolean> {
    // TODO: Implement guest data migration logic
    console.log(`Migrating guest data from ${guestId} to user ${userId}`);
    return true;
  }
}
```

##### `google-login.use-case.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { GoogleLoginDto } from '../../dtos/auth/google-login.dto';
import { AuthResponseDto } from '../../dtos/auth/auth-response.dto';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { ApplicationException } from '../../../shared/exceptions/application.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: GoogleLoginDto): Promise<AuthResponseDto> {
    // Find existing user
    const user = await this.userRepository.findByGoogleId(dto.googleId);
    if (!user) {
      throw new ApplicationException('Account not found');
    }

    // Update user info
    user.updateProfile(dto.name, dto.avatar);
    const updatedUser = await this.userRepository.update(user);

    // Generate JWT token
    const payload = { sub: updatedUser.id, email: updatedUser.email.value };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: UserResponseDto.fromEntity(updatedUser),
      accessToken,
    };
  }
}
```

#### User Use Cases (`src/application/use-cases/users/`)

##### `create-user.use-case.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../dtos/users/create-user.dto';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { ApplicationException } from '../../../shared/exceptions/application.exception';
import { Email } from '../../../domain/value-objects/email.vo';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByGoogleId(dto.googleId);
    if (existingUser) {
      throw new ApplicationException('User already exists');
    }

    // Check if email is already in use
    const emailVo = Email.from(dto.email);
    const existingEmailUser = await this.userRepository.findByEmail(emailVo);
    if (existingEmailUser) {
      throw new ApplicationException('Email already in use');
    }

    // Create new user
    const user = User.create({
      googleId: dto.googleId,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
      locale: dto.locale,
    });

    const savedUser = await this.userRepository.save(user);
    return UserResponseDto.fromEntity(savedUser);
  }
}
```

##### `update-user.use-case.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { UpdateUserDto } from '../../dtos/users/update-user.dto';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { EntityNotFoundDomainException } from '../../../shared/exceptions/domain.exception';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundDomainException('User', userId);
    }

    // Update profile if name or avatar provided
    if (dto.name !== undefined || dto.avatar !== undefined) {
      user.updateProfile(dto.name || user.name, dto.avatar);
    }

    // Update locale if provided
    if (dto.locale !== undefined) {
      user.changeLocale(dto.locale);
    }

    const updatedUser = await this.userRepository.update(user);
    return UserResponseDto.fromEntity(updatedUser);
  }
}
```

##### `get-user.use-case.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { EntityNotFoundDomainException } from '../../../shared/exceptions/domain.exception';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundDomainException('User', userId);
    }

    return UserResponseDto.fromEntity(user);
  }
}
```

#### Progress Use Cases (`src/application/use-cases/progress/`)

##### `update-word-progress.use-case.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { WordProgress } from '../../../domain/entities/word-progress.entity';
import { ProgressRepository, PROGRESS_REPOSITORY } from '../../../domain/repositories/progress.repository.interface';
import { UpdateWordProgressDto } from '../../dtos/progress/word-progress.dto';
import { WordProgressResponseDto } from '../../dtos/progress/word-progress.dto';
import { WordId } from '../../../domain/value-objects/word-id.vo';

@Injectable()
export class UpdateWordProgressUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: number, dto: UpdateWordProgressDto): Promise<WordProgressResponseDto> {
    const wordId = WordId.from(dto.wordId);
    
    let progress = await this.progressRepository.findWordProgress(userId, wordId);
    
    if (!progress) {
      // Create new progress entry
      progress = WordProgress.create({
        userId,
        wordId: dto.wordId,
      });
    }

    // Record the attempt
    progress.recordAttempt(dto.isCorrect);

    // Save the updated progress
    const savedProgress = progress.id 
      ? await this.progressRepository.updateWordProgress(progress)
      : await this.progressRepository.saveWordProgress(progress);

    return WordProgressResponseDto.fromEntity(savedProgress);
  }
}
```

##### `get-user-progress.use-case.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ProgressRepository, PROGRESS_REPOSITORY } from '../../../domain/repositories/progress.repository.interface';
import { WordProgressResponseDto } from '../../dtos/progress/word-progress.dto';

@Injectable()
export class GetUserProgressUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: number): Promise<WordProgressResponseDto[]> {
    const progressList = await this.progressRepository.findUserProgress(userId);
    return progressList.map(progress => WordProgressResponseDto.fromEntity(progress));
  }
}
```

##### `get-study-stats.use-case.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ProgressRepository, PROGRESS_REPOSITORY } from '../../../domain/repositories/progress.repository.interface';
import { StudyStatsResponseDto } from '../../dtos/progress/study-stats.dto';

@Injectable()
export class GetStudyStatsUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: number): Promise<StudyStatsResponseDto> {
    const [stats, progressList] = await Promise.all([
      this.progressRepository.getUserStats(userId),
      this.progressRepository.findUserProgress(userId),
    ]);

    return StudyStatsResponseDto.fromData(stats, progressList);
  }
}
```

##### `start-study-session.use-case.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { StudySession } from '../../../domain/entities/study-session.entity';
import { ProgressRepository, PROGRESS_REPOSITORY } from '../../../domain/repositories/progress.repository.interface';
import { StartStudySessionDto } from '../../dtos/progress/study-session.dto';
import { StudySessionResponseDto } from '../../dtos/progress/study-session.dto';
import { ApplicationException } from '../../../shared/exceptions/application.exception';

@Injectable()
export class StartStudySessionUseCase {
  constructor(
    @Inject(PROGRESS_REPOSITORY)
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: number, dto: StartStudySessionDto): Promise<StudySessionResponseDto> {
    // Check if there's already an active session
    const activeSession = await this.progressRepository.findActiveSession(userId);
    if (activeSession) {
      throw new ApplicationException('Active study session already exists');
    }

    // Create new session
    const sessionId = StudySession.generateSessionId(userId);
    const session = StudySession.create({
      userId,
      sessionId,
      metadata: dto.metadata,
    });

    const savedSession = await this.progressRepository.saveStudySession(session);
    return StudySessionResponseDto.fromEntity(savedSession);
  }
}
```

#### Wordbook Use Cases (`src/application/use-cases/wordbooks/`)

##### `create-wordbook.use-case.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { Wordbook } from '../../../domain/entities/wordbook.entity';
import { WordbookRepository, WORDBOOK_REPOSITORY } from '../../../domain/repositories/wordbook.repository.interface';
import { WordbookValidationService } from '../../../domain/services/wordbook-validation.service';
import { CreateWordbookDto } from '../../dtos/wordbooks/create-wordbook.dto';
import { WordbookResponseDto } from '../../dtos/wordbooks/wordbook-response.dto';

@Injectable()
export class CreateWordbookUseCase {
  constructor(
    @Inject(WORDBOOK_REPOSITORY)
    private readonly wordbookRepository: WordbookRepository,
    private readonly wordbookValidationService: WordbookValidationService,
  ) {}

  async execute(userId: number, dto: CreateWordbookDto): Promise<WordbookResponseDto> {
    // Validate wordbook data
    this.wordbookValidationService.validateWordbookSize(dto.wordIds);

    // Create wordbook entity
    const wordbook = Wordbook.create({
      userId,
      name: dto.name,
      description: dto.description,
      wordIds: dto.wordIds,
      categories: dto.categories,
      difficulties: dto.difficulties,
      tags: dto.tags,
      isPublic: dto.isPublic,
    });

    // Validate the created wordbook
    this.wordbookValidationService.validateWordbook(wordbook);

    // Save wordbook
    const savedWordbook = await this.wordbookRepository.save(wordbook);
    return WordbookResponseDto.fromEntity(savedWordbook, userId);
  }
}
```

### 6. Application Services (`src/application/services/`)

#### `auth.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { GoogleSignupUseCase } from '../use-cases/auth/google-signup.use-case';
import { GoogleLoginUseCase } from '../use-cases/auth/google-login.use-case';
import { GoogleLoginDto } from '../dtos/auth/google-login.dto';
import { AuthResponseDto } from '../dtos/auth/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly googleSignupUseCase: GoogleSignupUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
  ) {}

  async handleGoogleSignup(dto: GoogleLoginDto, guestId?: string): Promise<AuthResponseDto> {
    return this.googleSignupUseCase.execute(dto, guestId);
  }

  async handleGoogleLogin(dto: GoogleLoginDto): Promise<AuthResponseDto> {
    return this.googleLoginUseCase.execute(dto);
  }

  async migrateGuestData(userId: number, guestId: string): Promise<boolean> {
    // TODO: Implement guest data migration logic
    console.log(`Migrating guest data from ${guestId} to user ${userId}`);
    return true;
  }
}
```

### 7. Module 설정

#### `application.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Use Cases
import { GoogleSignupUseCase } from './use-cases/auth/google-signup.use-case';
import { GoogleLoginUseCase } from './use-cases/auth/google-login.use-case';
import { CreateUserUseCase } from './use-cases/users/create-user.use-case';
import { UpdateUserUseCase } from './use-cases/users/update-user.use-case';
import { GetUserUseCase } from './use-cases/users/get-user.use-case';
import { UpdateWordProgressUseCase } from './use-cases/progress/update-word-progress.use-case';
import { GetUserProgressUseCase } from './use-cases/progress/get-user-progress.use-case';
import { GetStudyStatsUseCase } from './use-cases/progress/get-study-stats.use-case';
import { StartStudySessionUseCase } from './use-cases/progress/start-study-session.use-case';
import { CreateWordbookUseCase } from './use-cases/wordbooks/create-wordbook.use-case';

// Application Services
import { AuthService } from './services/auth.service';

// Domain Services
import { WordbookValidationService } from '../domain/services/wordbook-validation.service';
import { ProgressCalculationService } from '../domain/services/progress-calculation.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    // Use Cases - Auth
    GoogleSignupUseCase,
    GoogleLoginUseCase,
    
    // Use Cases - Users
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserUseCase,
    
    // Use Cases - Progress
    UpdateWordProgressUseCase,
    GetUserProgressUseCase,
    GetStudyStatsUseCase,
    StartStudySessionUseCase,
    
    // Use Cases - Wordbooks
    CreateWordbookUseCase,
    
    // Application Services
    AuthService,
    
    // Domain Services
    WordbookValidationService,
    ProgressCalculationService,
  ],
  exports: [
    // Use Cases - Auth
    GoogleSignupUseCase,
    GoogleLoginUseCase,
    
    // Use Cases - Users
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserUseCase,
    
    // Use Cases - Progress
    UpdateWordProgressUseCase,
    GetUserProgressUseCase,
    GetStudyStatsUseCase,
    StartStudySessionUseCase,
    
    // Use Cases - Wordbooks
    CreateWordbookUseCase,
    
    // Application Services
    AuthService,
    
    // Domain Services
    WordbookValidationService,
    ProgressCalculationService,
  ],
})
export class ApplicationModule {}
```

## 테스트 작성

### DTO 테스트 (`src/application/dtos/__tests__/`)

#### `create-user.dto.spec.ts`
```typescript
import { validate } from 'class-validator';
import { CreateUserDto } from '../users/create-user.dto';

describe('CreateUserDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new CreateUserDto();
    dto.googleId = 'google-123';
    dto.email = 'test@example.com';
    dto.name = 'Test User';
    dto.avatar = 'https://example.com/avatar.jpg';
    dto.locale = 'en';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = new CreateUserDto();
    dto.googleId = 'google-123';
    dto.email = 'invalid-email';
    dto.name = 'Test User';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with empty name', async () => {
    const dto = new CreateUserDto();
    dto.googleId = 'google-123';
    dto.email = 'test@example.com';
    dto.name = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });

  it('should fail validation with invalid locale', async () => {
    const dto = new CreateUserDto();
    dto.googleId = 'google-123';
    dto.email = 'test@example.com';
    dto.name = 'Test User';
    dto.locale = 'invalid';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('locale');
  });
});
```

### Use Case 테스트 (`src/application/use-cases/__tests__/`)

#### `create-user.use-case.spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../users/create-user.use-case';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../dtos/users/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { ApplicationException } from '../../../shared/exceptions/application.exception';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByGoogleId: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get(USER_REPOSITORY);
  });

  describe('execute', () => {
    const validDto: CreateUserDto = {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      locale: 'en',
    };

    it('should create user successfully', async () => {
      userRepository.findByGoogleId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      
      const savedUser = User.create(validDto);
      savedUser.setId(1);
      userRepository.save.mockResolvedValue(savedUser);

      const result = await useCase.execute(validDto);

      expect(result.id).toBe(1);
      expect(result.email).toBe(validDto.email);
      expect(result.name).toBe(validDto.name);
      expect(userRepository.findByGoogleId).toHaveBeenCalledWith(validDto.googleId);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const existingUser = User.create(validDto);
      userRepository.findByGoogleId.mockResolvedValue(existingUser);

      await expect(useCase.execute(validDto)).rejects.toThrow(ApplicationException);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error if email is already in use', async () => {
      userRepository.findByGoogleId.mockResolvedValue(null);
      
      const existingUser = User.create({
        ...validDto,
        googleId: 'different-google-id',
      });
      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(useCase.execute(validDto)).rejects.toThrow(ApplicationException);
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
```

## PR 체크리스트

### DTO 설계
- [ ] 모든 DTO에 적절한 validation 규칙 적용
- [ ] Request/Response DTO 분리
- [ ] Entity에서 DTO로의 변환 메서드 구현
- [ ] 선택적 필드에 대한 올바른 처리

### Use Case 구현
- [ ] 각 Use Case가 단일 비즈니스 작업을 담당
- [ ] 도메인 엔티티를 통한 비즈니스 로직 실행
- [ ] Repository를 통한 데이터 액세스
- [ ] 적절한 예외 처리

### 코드 품질
- [ ] 모든 Use Case에 대한 단위 테스트 작성
- [ ] DTO validation 테스트 포함
- [ ] 에러 시나리오 테스트 커버리지
- [ ] Mock을 통한 의존성 격리

### 아키텍처 준수
- [ ] Application 계층이 Infrastructure에 의존하지 않음
- [ ] Use Case가 도메인 엔티티를 올바르게 사용
- [ ] DTO를 통한 명확한 API 계약
- [ ] 의존성 주입을 통한 Repository 사용

## 다음 단계 준비사항

1. **Repository 구현**: Domain Repository 인터페이스의 구체적 구현체 작성
2. **Infrastructure 모듈**: 데이터베이스 어댑터 및 외부 서비스 연동
3. **Controller 리팩토링**: Use Case를 사용하도록 컨트롤러 수정

## 예상 작업 시간

- **DTO 구현**: 1.5일
- **Use Case 구현**: 2.5일
- **Application Service 리팩토링**: 1일
- **단위 테스트 작성**: 2일
- **통합 및 문서화**: 1일

**총 예상 시간**: 8일

이 단계를 완료하면 비즈니스 로직이 명확하게 정의되고, API 계약이 타입 안전하게 구현되어 안정적인 애플리케이션 계층이 구축됩니다.