# Phase 5: Presentation Layer Implementation

## 📋 Phase 개요

**목표**: Controller 리팩토링과 Swagger 문서화를 통해 API 엔드포인트를 Clean Architecture에 맞게 재구성합니다.

**기간**: 1 week  
**우선순위**: P1 (높음)  
**의존성**: Phase 4 완료 (Infrastructure Layer)

## 🎯 주요 목표

1. **Controller 리팩토링**: Use Cases를 호출하는 얇은 Controller 구현
2. **Swagger 문서화**: 완전한 API 문서 자동 생성
3. **입력 검증 파이프라인**: DTO 검증 및 변환 자동화
4. **응답 표준화**: 일관된 API 응답 형태 구축

## 📚 관련 PRD 문서

- **주요 참조**: [Swagger Integration PRD](../features/swagger-integration.md)
- **보조 참조**: 
  - [DTO Validation System PRD](../features/dto-validation-system.md)
  - [Error Handling System PRD](../features/error-handling-system.md)

## 🏗️ 구현 범위

### 1. Controller 리팩토링

#### User Controller 구현
```typescript
// src/presentation/controllers/user.controller.ts
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
    description: 'Register a new user account with Google OAuth information',
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: UserResponseApiDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'User already exists',
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
    summary: 'Update user profile',
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
    summary: 'Delete user account',
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

### 2. Swagger 설정 구현

#### Main.ts Swagger 설정
```typescript
// src/main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function setupSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle('Polarist API')
    .setDescription('Korean Language Learning Platform API')
    .setVersion('1.0')
    .addServer('http://localhost:4000', 'Development')
    .addServer('https://api.polarist.app', 'Production')
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

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  });

  // OpenAPI spec 파일 저장 (클라이언트 SDK 생성용)
  if (process.env.NODE_ENV === 'development') {
    const fs = require('fs');
    fs.writeFileSync('./api-spec.json', JSON.stringify(document, null, 2));
  }

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Polarist API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors: ValidationError[]) => {
      const formattedErrors = formatValidationErrors(errors);
      return new ValidationException(formattedErrors);
    },
  }));

  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger setup
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

bootstrap();
```

### 3. 응답 변환 인터셉터

#### Response Transform Interceptor
```typescript
// src/presentation/interceptors/response-transform.interceptor.ts
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    return next.handle().pipe(
      map(data => {
        // 에러 응답은 GlobalExceptionFilter에서 처리하므로 성공 응답만 변환
        const response: ApiSuccessResponse = {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
          traceId: this.generateTraceId(),
        };
        
        return response;
      }),
    );
  }

  private generateTraceId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### 4. 커스텀 데코레이터

#### API 응답 데코레이터
```typescript
// src/presentation/decorators/api-responses.decorator.ts
export const ApiStandardResponses = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Invalid input data',
      type: ErrorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Authentication required',
      type: ErrorResponseDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      type: ErrorResponseDto,
    }),
  );
};

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  description: string = 'Paginated response'
) => {
  return applyDecorators(
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
```

### 5. 파일 업로드 지원

#### File Upload Controller
```typescript
// src/presentation/controllers/file.controller.ts
@ApiTags('files')
@Controller('files')
export class FileController {
  constructor(private readonly uploadFileUseCase: UploadFileUseCase) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
  }))
  @ApiOperation({ 
    summary: 'Upload file',
    description: 'Upload image file (max 10MB, jpg/png/gif only)'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
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
        mimetype: { type: 'string', example: 'image/jpeg' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid file format or size',
    type: ErrorResponseDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('description') description?: string,
  ): Promise<FileUploadResponseDto> {
    const result = await this.uploadFileUseCase.execute({
      file: file.buffer,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      description,
    });

    return FileUploadResponseDto.fromDomain(result);
  }
}
```

## ✅ 완료 기준 (Definition of Done)

### 기능적 완료 기준
- [ ] 모든 Controller가 Use Cases만 호출하도록 리팩토링 완료
- [ ] Swagger 문서가 모든 API 엔드포인트를 포함
- [ ] 입력 검증이 자동으로 작동
- [ ] 응답 형태가 표준화되어 일관성 유지

### 품질 완료 기준
- [ ] Controller 단위 테스트 완료 (커버리지 90% 이상)
- [ ] API 문서의 정확성 검증 완료
- [ ] 에러 응답 표준화 테스트 완료
- [ ] 파일 업로드 기능 테스트 완료

### 사용성 완료 기준
- [ ] Swagger UI에서 모든 API 테스트 가능
- [ ] 에러 메시지가 명확하고 도움이 됨
- [ ] API 응답 시간이 요구사항 충족 (평균 200ms 이하)

## 🧪 테스트 계획

### Controller 테스트
```typescript
describe('UserController', () => {
  let controller: UserController;
  let mockCreateUserUseCase: jest.Mocked<CreateUserUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: createMockCreateUserUseCase(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockCreateUserUseCase = module.get(CreateUserUseCase);
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const apiDto: CreateUserApiDto = {
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        locale: 'en',
      };

      const expectedResponse: UserResponseDto = {
        id: 1,
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        locale: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateUserUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.create(apiDto);

      expect(result).toMatchObject({
        id: 1,
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        locale: 'en',
      });
      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        locale: 'en',
      });
    });
  });
});
```

### E2E 테스트
```typescript
describe('User API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        locale: 'en',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.googleId).toBe('google-123');
        expect(res.body.data.email).toBe('test@example.com');
      });
  });

  it('/users (POST) - validation error', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        googleId: 'google-123',
        email: 'invalid-email', // 잘못된 이메일
        name: 'Test User',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.success).toBe(false);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
        expect(res.body.error.details.validationErrors.email).toBeDefined();
      });
  });
});
```

## 📊 성공 지표

### 정량적 지표
- **API 문서 완성도**: 100% 엔드포인트 문서화
- **응답 시간**: 평균 150ms 이하 (목표: 200ms 이하)
- **에러 응답 일관성**: 100% 표준화된 형태
- **테스트 커버리지**: Presentation Layer 90% 이상

### 정성적 지표
- **개발자 경험**: Swagger UI를 통한 직관적인 API 테스트
- **API 사용성**: 명확한 에러 메시지와 응답 구조
- **문서화 품질**: 실제 API와 문서의 일치도

## 🔄 다음 단계 준비

### Phase 6 준비사항
- [ ] 통합 테스트 시나리오 작성
- [ ] 성능 테스트 계획 수립
- [ ] 보안 검증 체크리스트 작성
- [ ] 배포 준비 체크리스트 작성

### 전달 사항
- Swagger API 문서 URL 및 사용법
- 에러 응답 처리 가이드라인
- 파일 업로드 API 사용법

## 🔗 관련 문서

### 상세 기술 문서
- [Swagger Integration Implementation Guide](../../docs/swagger-integration.md)
- [Phase 5 Implementation Guide](../../docs/phase-5-presentation.md)

### 이전/다음 Phase 문서
- [Phase 4: Infrastructure Layer](./phase-4-infrastructure.md)
- [Phase 6: Integration & Testing](./phase-6-integration.md)

---

**Phase Owner**: Senior Frontend/Backend Developer  
**Reviewers**: System Architect, QA Engineer  
**최종 업데이트**: 2024년 8월