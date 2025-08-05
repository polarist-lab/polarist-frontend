# Swagger Clean Architecture 통합 가이드

## 개요
Clean Architecture 원칙을 준수하면서 NestJS에서 Swagger를 효율적으로 통합하는 방법을 제시합니다. 이 가이드는 프레임워크 독립성을 유지하면서도 강력한 API 문서화를 제공합니다.

## 핵심 원칙

### 1. 레이어 분리
- **Presentation Layer**: Swagger 데코레이터는 Controller에서만 사용
- **Application Layer**: DTO는 순수하게 유지, 별도 API Schema 생성
- **Domain Layer**: 완전한 프레임워크 독립성 유지
- **Infrastructure Layer**: 데이터베이스 스키마와 API 스키마 분리

### 2. 이중 DTO 패턴
- **Domain DTO**: 비즈니스 로직용 순수 타입
- **API Schema DTO**: Swagger 문서화 및 검증용
- **Mapper Functions**: 두 DTO 간 변환 담당

## Phase 1: 기본 설정

### 1.1 패키지 설치
```bash
npm install --save @nestjs/swagger swagger-ui-express
npm install --save-dev @types/swagger-ui-express
```

### 1.2 Main.ts 설정
```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS 설정
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger 설정
  if (process.env.NODE_ENV !== 'production') {
    await setupSwagger(app);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 API Server running on http://localhost:${port}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 Swagger UI: http://localhost:${port}/api`);
  }
}

async function setupSwagger(app: any) {
  // Public API 문서
  const publicConfig = new DocumentBuilder()
    .setTitle('Polarist API')
    .setDescription('Korean Language Learning Platform API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('wordbooks', 'Wordbook operations')
    .addTag('progress', 'Learning progress tracking')
    .addTag('study', 'Study session management')
    .build();

  const publicDocument = SwaggerModule.createDocument(app, publicConfig, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('api', app, publicDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Polarist API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });
}

bootstrap();
```

## Phase 2: DTO 아키텍처 설계

### 2.1 Directory Structure
```
src/
├── shared/
│   ├── dtos/
│   │   ├── api/           # API Schema DTOs (Swagger용)
│   │   └── domain/        # Domain DTOs (순수 비즈니스 로직용)
│   ├── mappers/           # DTO 변환 함수들
│   └── decorators/        # 커스텀 Swagger 데코레이터
```

### 2.2 Domain DTO (순수 타입)
```typescript
// src/shared/dtos/domain/user.dto.ts
export interface CreateUserDomainDto {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale?: string;
}

export interface UpdateUserDomainDto {
  name?: string;
  avatar?: string;
  locale?: string;
}

export interface UserResponseDomainDto {
  id: number;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.3 API Schema DTO (Swagger용)
```typescript
// src/shared/dtos/api/user.dto.ts
import { ApiProperty, ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsEmail, 
  IsOptional, 
  MinLength, 
  MaxLength, 
  IsIn 
} from 'class-validator';

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
  @IsString()
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

### 2.4 DTO Mapper
```typescript
// src/shared/mappers/user.mapper.ts
import { 
  CreateUserDomainDto, 
  UpdateUserDomainDto, 
  UserResponseDomainDto 
} from '../dtos/domain/user.dto';
import { 
  CreateUserApiDto, 
  UpdateUserApiDto, 
  UserResponseApiDto 
} from '../dtos/api/user.dto';

export class UserDtoMapper {
  static apiToDomain(apiDto: CreateUserApiDto): CreateUserDomainDto {
    return {
      googleId: apiDto.googleId,
      email: apiDto.email,
      name: apiDto.name,
      avatar: apiDto.avatar,
      locale: apiDto.locale,
    };
  }

  static apiUpdateToDomain(apiDto: UpdateUserApiDto): UpdateUserDomainDto {
    return {
      name: apiDto.name,
      avatar: apiDto.avatar,
      locale: apiDto.locale,
    };
  }

  static domainToApi(domainDto: UserResponseDomainDto): UserResponseApiDto {
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

  static domainListToApi(domainList: UserResponseDomainDto[]): UserResponseApiDto[] {
    return domainList.map(this.domainToApi);
  }
}
```

## Phase 3: Controller 문서화

### 3.1 Controller 구현
```typescript
// src/presentation/controllers/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import {
  CreateUserApiDto,
  UpdateUserApiDto,
  UserResponseApiDto,
} from '../../shared/dtos/api/user.dto';
import { UserDtoMapper } from '../../shared/mappers/user.mapper';
import { ErrorResponseDto } from '../../shared/dtos/api/error.dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create new user',
    description: 'Create a new user account with Google OAuth information',
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: UserResponseApiDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  async create(@Body() createUserDto: CreateUserApiDto): Promise<UserResponseApiDto> {
    const domainDto = UserDtoMapper.apiToDomain(createUserDto);
    const result = await this.createUserUseCase.execute(domainDto);
    return UserDtoMapper.domainToApi(result);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve user information by user ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'User ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'User found',
    type: UserResponseApiDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    type: ErrorResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseApiDto> {
    const result = await this.getUserUseCase.execute(id);
    return UserDtoMapper.domainToApi(result);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update user',
    description: 'Update user profile information',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'User ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'User successfully updated',
    type: UserResponseApiDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserApiDto,
  ): Promise<UserResponseApiDto> {
    const domainDto = UserDtoMapper.apiUpdateToDomain(updateUserDto);
    const result = await this.updateUserUseCase.execute(id, domainDto);
    return UserDtoMapper.domainToApi(result);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete user account permanently',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'User ID',
    example: 1,
  })
  @ApiOkResponse({
    description: 'User successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User deleted successfully',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ErrorResponseDto,
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.deleteUserUseCase.execute(id);
    return { message: 'User deleted successfully' };
  }
}
```

### 3.2 Error Response DTO
```typescript
// src/shared/dtos/api/error.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Error information',
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'VALIDATION_ERROR',
        description: 'Error code',
      },
      message: {
        type: 'string',
        example: 'Input validation failed',
        description: 'Error message',
      },
      details: {
        type: 'object',
        description: 'Additional error details',
        example: {
          validationErrors: {
            email: ['Invalid email format'],
            name: ['Name is required'],
          },
        },
      },
    },
  })
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2023-01-01T00:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path where error occurred',
    example: '/api/users',
  })
  path: string;

  @ApiPropertyOptional({
    description: 'Trace ID for debugging',
    example: '1642781234567-abc123def',
  })
  traceId?: string;
}
```

## Phase 4: 고급 기능

### 4.1 커스텀 데코레이터
```typescript
// src/shared/decorators/api-paginated-response.decorator.ts
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Paginated response',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          total: {
            type: 'number',
            example: 100,
            description: 'Total number of items',
          },
          page: {
            type: 'number',
            example: 1,
            description: 'Current page number',
          },
          limit: {
            type: 'number',
            example: 20,
            description: 'Items per page',
          },
          totalPages: {
            type: 'number',
            example: 5,
            description: 'Total number of pages',
          },
          hasNext: {
            type: 'boolean',
            example: true,
            description: 'Has next page',
          },
          hasPrev: {
            type: 'boolean',
            example: false,
            description: 'Has previous page',
          },
        },
      },
    }),
  );
};
```

### 4.2 파일 업로드 문서화
```typescript
// src/presentation/controllers/file.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('files')
@Controller('files')
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload',
        },
        description: {
          type: 'string',
          description: 'File description',
          example: 'Profile picture',
        },
      },
      required: ['file'],
    },
  })
  @ApiCreatedResponse({
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'file-123' },
        filename: { type: 'string', example: 'profile.jpg' },
        url: { type: 'string', example: 'https://cdn.example.com/files/profile.jpg' },
        size: { type: 'number', example: 102400 },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    // 파일 업로드 로직
    return {
      id: 'file-123',
      filename: file.originalname,
      url: `https://cdn.example.com/files/${file.filename}`,
      size: file.size,
    };
  }
}
```

### 4.3 자동 Client SDK 생성
```typescript
// scripts/generate-client.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generateClient() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Polarist API')
    .setDescription('Korean Language Learning Platform API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // OpenAPI JSON 파일 생성
  const outputPath = path.resolve(process.cwd(), 'api-spec.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  
  console.log(`OpenAPI spec generated at: ${outputPath}`);
  console.log('Run the following to generate TypeScript client:');
  console.log('npx @openapitools/openapi-generator-cli generate -i api-spec.json -g typescript-axios -o ./client');
  
  await app.close();
}

generateClient().catch(console.error);
```

### 4.4 TypeScript 타입 동기화
```typescript
// src/shared/types/api.types.ts
import { components } from './generated/api'; // OpenAPI 생성된 타입

export type ApiUser = components['schemas']['UserResponseApiDto'];
export type ApiCreateUser = components['schemas']['CreateUserApiDto'];
export type ApiUpdateUser = components['schemas']['UpdateUserApiDto'];
export type ApiError = components['schemas']['ErrorResponseDto'];

// 런타임 타입 검증
export function isApiUser(obj: any): obj is ApiUser {
  return obj && typeof obj.id === 'number' && typeof obj.email === 'string';
}
```

## 사용 가이드

### Development 환경
```bash
# 개발 서버 시작
npm run start:dev

# Swagger UI 접속
# http://localhost:4000/api
```

### Production 환경
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작 (Swagger 비활성화)
NODE_ENV=production npm start
```

### Client SDK 생성
```bash
# API 스펙 생성
npm run generate:api-spec

# TypeScript 클라이언트 생성
npm run generate:client
```

## 장점

1. **Clean Architecture 준수**: 도메인 로직이 프레임워크에 의존하지 않음
2. **타입 안전성**: Domain과 API 레이어 간 타입 안전한 변환
3. **자동 문서화**: 코드 변경 시 API 문서 자동 동기화
4. **개발자 경험**: 인터랙티브 API 테스트 및 클라이언트 SDK 자동 생성
5. **유지보수성**: 레이어별 책임 분리로 코드 관리 용이

이 구조를 통해 Clean Architecture의 장점을 유지하면서도 강력한 API 문서화를 제공할 수 있습니다.