# Phase 5: Presentation Layer (프레젠테이션 계층)

## 목표
컨트롤러와 미들웨어를 리팩토링하여 Use Case를 통해 비즈니스 로직을 실행하고, 일관된 API 응답을 제공합니다.

## 범위
- Controller 리팩토링 (Use Case 의존성 주입)
- 통합된 예외 필터 적용
- 인증/인가 가드 개선
- API 문서화 (Swagger) 추가

## 구현할 파일 목록

### 1. 리팩토링된 Controllers (`src/presentation/controllers/`)

#### `auth.controller.ts`
```typescript
import { 
  Controller, 
  Get, 
  Post, 
  UseGuards, 
  Req, 
  Res, 
  Query, 
  Body,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';

// Use Cases
import { GoogleSignupUseCase } from '../../application/use-cases/auth/google-signup.use-case';
import { GoogleLoginUseCase } from '../../application/use-cases/auth/google-login.use-case';

// DTOs
import { GoogleLoginDto } from '../../application/dtos/auth/google-login.dto';
import { AuthResponseDto } from '../../application/dtos/auth/auth-response.dto';
import { MigrateGuestDataDto } from '../../application/dtos/auth/google-login.dto';

// Guards
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

// Types
import { AuthenticatedRequest } from '../types/request.types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly googleSignupUseCase: GoogleSignupUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
  ) {}

  @Get('mock-login')
  @ApiOperation({ summary: 'Mock login for testing (remove in production)' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend with token' })
  async mockLogin(@Res() res: Response) {
    const mockGoogleUser: GoogleLoginDto = {
      googleId: 'mock-google-id-123',
      email: 'test@example.com',
      name: '테스트 사용자',
      avatar: 'https://via.placeholder.com/32',
    };

    const authResponse = await this.googleLoginUseCase.execute(mockGoogleUser);
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${authResponse.accessToken}`);
  }

  @Get('google/signup')
  @UseGuards(AuthGuard('google-signup'))
  @ApiOperation({ summary: 'Initiate Google OAuth signup' })
  @ApiQuery({ name: 'guest_id', required: false, description: 'Guest ID for data migration' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
  async googleSignup(@Query('guest_id') guestId?: string) {
    // OAuth 시작 with signup intent
    // guest_id는 Passport strategy에서 사용하기 위해 session에 저장
  }

  @Get('google/signup/redirect')
  @UseGuards(AuthGuard('google-signup'))
  @ApiOperation({ summary: 'Handle Google OAuth signup callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend' })
  async googleSignupCallback(@Req() req: any, @Res() res: Response) {
    try {
      const authResponse = await this.googleSignupUseCase.execute(
        req.user, 
        req.session?.guestId
      );
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      res.redirect(
        `${frontendUrl}/auth/callback?token=${authResponse.accessToken}&new_user=true&migrated=${authResponse.guestDataMigrated}`
      );
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const reason = error.message.includes('already exists') ? 'account_exists' : 'signup_failed';
      res.redirect(`${frontendUrl}/auth/error?reason=${reason}`);
    }
  }

  @Get('google/signin')
  @UseGuards(AuthGuard('google-login'))
  @ApiOperation({ summary: 'Initiate Google OAuth signin' })
  @ApiResponse({ status: 302, description: 'Redirects to Google OAuth' })
  async googleSignin() {
    // OAuth 시작 with signin intent
  }

  @Get('google/signin/redirect')
  @UseGuards(AuthGuard('google-login'))
  @ApiOperation({ summary: 'Handle Google OAuth signin callback' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend' })
  async googleSigninCallback(@Req() req: any, @Res() res: Response) {
    try {
      const authResponse = await this.googleLoginUseCase.execute(req.user);
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/callback?token=${authResponse.accessToken}`);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const reason = error.message.includes('not found') ? 'account_not_found' : 'login_failed';
      res.redirect(`${frontendUrl}/auth/error?reason=${reason}`);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved', type: AuthResponseDto })
  async getProfile(@Req() req: AuthenticatedRequest) {
    return {
      user: req.user,
      message: 'User profile retrieved successfully',
    };
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res() res: Response) {
    res.json({ message: 'Logged out successfully' });
  }

  @Post('migrate-guest-data')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Migrate guest data to authenticated user' })
  @ApiResponse({ status: 200, description: 'Guest data migrated successfully' })
  async migrateGuestData(
    @Req() req: AuthenticatedRequest, 
    @Body() dto: MigrateGuestDataDto
  ) {
    try {
      // TODO: Implement guest data migration use case
      const success = true; // await this.migrateGuestDataUseCase.execute(req.user.id, dto.guestId);
      return { 
        success, 
        message: success ? 'Guest data migrated successfully' : 'No guest data found' 
      };
    } catch (error: unknown) {
      return { 
        success: false, 
        message: 'Migration failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
```

#### `users.controller.ts`
```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/users/get-user.use-case';

// DTOs
import { CreateUserDto } from '../../application/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/users/update-user.dto';
import { UserResponseDto } from '../../application/dtos/users/user-response.dto';

// Guards & Types
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/request.types';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved', type: UserResponseDto })
  async getCurrentUser(@Req() req: AuthenticatedRequest): Promise<UserResponseDto> {
    return this.getUserUseCase.execute(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.getUserUseCase.execute(id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async updateCurrentUser(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.updateUserUseCase.execute(req.user.id, updateUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest
  ): Promise<UserResponseDto> {
    // TODO: Add admin role check or restrict to self-update only
    if (req.user.id !== id) {
      throw new Error('Can only update own profile');
    }
    
    return this.updateUserUseCase.execute(id, updateUserDto);
  }
}
```

#### `progress.controller.ts`
```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { UpdateWordProgressUseCase } from '../../application/use-cases/progress/update-word-progress.use-case';
import { GetUserProgressUseCase } from '../../application/use-cases/progress/get-user-progress.use-case';
import { GetStudyStatsUseCase } from '../../application/use-cases/progress/get-study-stats.use-case';
import { StartStudySessionUseCase } from '../../application/use-cases/progress/start-study-session.use-case';

// DTOs
import { UpdateWordProgressDto, WordProgressResponseDto, ResetWordProgressDto } from '../../application/dtos/progress/word-progress.dto';
import { StartStudySessionDto, StudySessionResponseDto } from '../../application/dtos/progress/study-session.dto';
import { StudyStatsResponseDto } from '../../application/dtos/progress/study-stats.dto';

// Guards & Types
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/request.types';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(
    private readonly updateWordProgressUseCase: UpdateWordProgressUseCase,
    private readonly getUserProgressUseCase: GetUserProgressUseCase,
    private readonly getStudyStatsUseCase: GetStudyStatsUseCase,
    private readonly startStudySessionUseCase: StartStudySessionUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user progress for all words' })
  @ApiResponse({ status: 200, description: 'User progress retrieved', type: [WordProgressResponseDto] })
  async getUserProgress(@Req() req: AuthenticatedRequest): Promise<WordProgressResponseDto[]> {
    return this.getUserProgressUseCase.execute(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user study statistics' })
  @ApiResponse({ status: 200, description: 'Study stats retrieved', type: StudyStatsResponseDto })
  async getStudyStats(@Req() req: AuthenticatedRequest): Promise<StudyStatsResponseDto> {
    return this.getStudyStatsUseCase.execute(req.user.id);
  }

  @Post('words')
  @ApiOperation({ summary: 'Update word learning progress' })
  @ApiResponse({ status: 200, description: 'Word progress updated', type: WordProgressResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async updateWordProgress(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateWordProgressDto
  ): Promise<WordProgressResponseDto> {
    return this.updateWordProgressUseCase.execute(req.user.id, dto);
  }

  @Delete('words/:wordId')
  @ApiOperation({ summary: 'Reset word progress' })
  @ApiParam({ name: 'wordId', description: 'Word ID to reset' })
  @ApiResponse({ status: 200, description: 'Word progress reset successfully' })
  @ApiResponse({ status: 404, description: 'Word progress not found' })
  async resetWordProgress(
    @Req() req: AuthenticatedRequest,
    @Param('wordId') wordId: string
  ) {
    // TODO: Implement reset word progress use case
    return { message: 'Word progress reset successfully', wordId };
  }

  @Post('sessions')
  @ApiOperation({ summary: 'Start a new study session' })
  @ApiResponse({ status: 201, description: 'Study session started', type: StudySessionResponseDto })
  @ApiResponse({ status: 400, description: 'Active session already exists' })
  async startStudySession(
    @Req() req: AuthenticatedRequest,
    @Body() dto: StartStudySessionDto
  ): Promise<StudySessionResponseDto> {
    return this.startStudySessionUseCase.execute(req.user.id, dto);
  }

  @Put('sessions/:sessionId/end')
  @ApiOperation({ summary: 'End an active study session' })
  @ApiParam({ name: 'sessionId', description: 'Study session ID' })
  @ApiResponse({ status: 200, description: 'Study session ended', type: StudySessionResponseDto })
  @ApiResponse({ status: 404, description: 'Study session not found' })
  async endStudySession(
    @Param('sessionId') sessionId: string,
    @Body() dto: { duration: number; metadata?: Record<string, any> }
  ) {
    // TODO: Implement end study session use case
    return { message: 'Study session ended successfully', sessionId };
  }
}
```

#### `wordbooks.controller.ts`
```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

// Use Cases
import { CreateWordbookUseCase } from '../../application/use-cases/wordbooks/create-wordbook.use-case';

// DTOs
import { CreateWordbookDto } from '../../application/dtos/wordbooks/create-wordbook.dto';
import { UpdateWordbookDto, ShareWordbookDto } from '../../application/dtos/wordbooks/update-wordbook.dto';
import { WordbookResponseDto, WordbookListResponseDto } from '../../application/dtos/wordbooks/wordbook-response.dto';

// Guards & Types
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/request.types';

@ApiTags('Wordbooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wordbooks')
export class WordbooksController {
  constructor(
    private readonly createWordbookUseCase: CreateWordbookUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wordbook' })
  @ApiResponse({ status: 201, description: 'Wordbook created successfully', type: WordbookResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async createWordbook(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateWordbookDto
  ): Promise<WordbookResponseDto> {
    return this.createWordbookUseCase.execute(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user wordbooks' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  @ApiResponse({ status: 200, description: 'Wordbooks retrieved', type: WordbookListResponseDto })
  async getUserWordbooks(
    @Req() req: AuthenticatedRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ): Promise<WordbookListResponseDto> {
    // TODO: Implement get user wordbooks use case
    return {
      wordbooks: [],
      total: 0,
      page: Number(page),
      limit: Number(limit),
      hasNext: false,
      hasPrev: false,
    };
  }

  @Get('public')
  @ApiOperation({ summary: 'Get public wordbooks' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  @ApiQuery({ name: 'tags', required: false, description: 'Filter by tags (comma-separated)' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'search', required: false, description: 'Search in wordbook names' })
  @ApiResponse({ status: 200, description: 'Public wordbooks retrieved', type: WordbookListResponseDto })
  async getPublicWordbooks(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('tags') tags?: string,
    @Query('category') category?: string,
    @Query('search') search?: string
  ): Promise<WordbookListResponseDto> {
    // TODO: Implement get public wordbooks use case
    return {
      wordbooks: [],
      total: 0,
      page: Number(page),
      limit: Number(limit),
      hasNext: false,
      hasPrev: false,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wordbook by ID' })
  @ApiParam({ name: 'id', description: 'Wordbook ID' })
  @ApiResponse({ status: 200, description: 'Wordbook found', type: WordbookResponseDto })
  @ApiResponse({ status: 404, description: 'Wordbook not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async getWordbookById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest
  ): Promise<WordbookResponseDto> {
    // TODO: Implement get wordbook by id use case
    throw new Error('Not implemented');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update wordbook' })
  @ApiParam({ name: 'id', description: 'Wordbook ID' })
  @ApiResponse({ status: 200, description: 'Wordbook updated successfully', type: WordbookResponseDto })
  @ApiResponse({ status: 403, description: 'Not authorized to update this wordbook' })
  @ApiResponse({ status: 404, description: 'Wordbook not found' })
  async updateWordbook(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWordbookDto,
    @Req() req: AuthenticatedRequest
  ): Promise<WordbookResponseDto> {
    // TODO: Implement update wordbook use case
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete wordbook' })
  @ApiParam({ name: 'id', description: 'Wordbook ID' })
  @ApiResponse({ status: 200, description: 'Wordbook deleted successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this wordbook' })
  @ApiResponse({ status: 404, description: 'Wordbook not found' })
  async deleteWordbook(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest
  ) {
    // TODO: Implement delete wordbook use case
    return { message: 'Wordbook deleted successfully', id };
  }

  @Put(':id/share')
  @ApiOperation({ summary: 'Enable/disable wordbook sharing' })
  @ApiParam({ name: 'id', description: 'Wordbook ID' })
  @ApiResponse({ status: 200, description: 'Wordbook sharing updated', type: WordbookResponseDto })
  async updateWordbookSharing(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ShareWordbookDto,
    @Req() req: AuthenticatedRequest
  ): Promise<WordbookResponseDto> {
    // TODO: Implement update wordbook sharing use case
    throw new Error('Not implemented');
  }

  @Get('shared/:shareCode')
  @ApiOperation({ summary: 'Get wordbook by share code' })
  @ApiParam({ name: 'shareCode', description: 'Wordbook share code' })
  @ApiResponse({ status: 200, description: 'Shared wordbook found', type: WordbookResponseDto })
  @ApiResponse({ status: 404, description: 'Shared wordbook not found' })
  async getSharedWordbook(@Param('shareCode') shareCode: string): Promise<WordbookResponseDto> {
    // TODO: Implement get shared wordbook use case
    throw new Error('Not implemented');
  }
}
```

### 2. 개선된 Guards (`src/presentation/guards/`)

#### `jwt-auth.guard.ts`
```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { UnauthorizedException } from '../../shared/exceptions/application.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);
      
      if (!token) {
        throw new UnauthorizedException('Access token is required');
      }
      
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token has expired');
      }
      
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid access token');
      }
      
      throw new UnauthorizedException('Authentication failed');
    }
    
    return user;
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;
    
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
```

#### `role.guard.ts`
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '../../shared/exceptions/application.exception';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export const ROLES_KEY = 'roles';
export const Roles = (Reflector as any).createDecorator(ROLES_KEY);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User information is required');
    }

    const userRole = user.role || Role.USER;
    const hasRole = requiredRoles.some(role => role === userRole);
    
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

### 3. 타입 정의 (`src/presentation/types/`)

#### `request.types.ts`
```typescript
import { Request } from 'express';
import { UserResponseDto } from '../../application/dtos/users/user-response.dto';

export interface AuthenticatedRequest extends Request {
  user: UserResponseDto & {
    id: number;
    role?: string;
  };
}

export interface GoogleAuthRequest extends Request {
  user: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
    intent?: 'signup' | 'login';
  };
}
```

### 4. Swagger 설정 (`src/presentation/swagger/`)

#### `swagger.config.ts`
```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Polarist Backend API')
    .setDescription('Korean Language Learning Platform API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addServer('http://localhost:4000', 'Development')
    .addServer('https://api.polarist.com', 'Production')
    .addTag('Authentication', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Progress', 'Learning progress endpoints')
    .addTag('Wordbooks', 'Wordbook management endpoints')
    .addTag('Health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
```

### 5. 개선된 인터셉터 (`src/presentation/interceptors/`)

#### `request-logging.interceptor.ts`
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    
    const { method, url, body, query, params, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = request.ip || headers['x-forwarded-for'] || 'unknown';
    const startTime = Date.now();

    const requestInfo = {
      method,
      url,
      query,
      params,
      body: this.sanitizeBody(body),
      userAgent,
      ip,
    };

    this.logger.log(`Incoming Request: ${method} ${url}`, requestInfo);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${response.statusCode} - ${duration}ms`,
            {
              statusCode: response.statusCode,
              duration,
              responseSize: JSON.stringify(data || {}).length,
            }
          );
        },
        error: (error) => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          this.logger.error(
            `Error Response: ${method} ${url} - ${error.status || 500} - ${duration}ms`,
            {
              error: error.message,
              stack: error.stack,
              duration,
            }
          );
        },
      })
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization'];
    const sanitized = { ...body };

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    });

    return sanitized;
  }
}
```

#### `transform.interceptor.ts`
```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponse } from '../../shared/types/api-response.type';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map(data => {
        // Skip transformation for redirects and non-JSON responses
        if (response.statusCode >= 300 && response.statusCode < 400) {
          return data;
        }

        // Skip transformation if data is already in API response format
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        } as ApiResponse;
      })
    );
  }
}
```

### 6. 업데이트된 예외 필터 (`src/presentation/filters/`)

#### `global-exception.filter.ts`
```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../../shared/exceptions/base.exception';
import { ValidationException } from '../../shared/exceptions/application.exception';
import { ApiResponse } from '../../shared/types/api-response.type';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, code, message, details } = this.parseException(exception);

    // Log error with appropriate level
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${status} - ${message}`,
        { details }
      );
    }

    const errorResponse: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }

  private parseException(exception: unknown) {
    if (exception instanceof BaseException) {
      return {
        status: exception.statusCode,
        code: exception.code,
        message: exception.message,
        details: exception.context,
      };
    }

    if (exception instanceof ValidationException) {
      return {
        status: exception.statusCode,
        code: exception.code,
        message: exception.message,
        details: exception.context,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      
      return {
        status,
        code: 'HTTP_EXCEPTION',
        message: typeof response === 'string' ? response : (response as any).message,
        details: typeof response === 'object' ? response : undefined,
      };
    }

    // Unknown exception
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      details: process.env.NODE_ENV === 'development' 
        ? { originalError: exception instanceof Error ? exception.message : String(exception) }
        : undefined,
    };
  }
}
```

### 7. JWT Strategy 개선 (`src/presentation/strategies/`)

#### `jwt.strategy.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { GetUserUseCase } from '../../application/use-cases/users/get-user.use-case';
import { UnauthorizedException } from '../../shared/exceptions/application.exception';

export interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly getUserUseCase: GetUserUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default-secret'),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.getUserUseCase.execute(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        locale: user.locale,
        role: 'user', // TODO: Add role management
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

### 8. Presentation Module (`src/presentation/presentation.module.ts`)

```typescript
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { ProgressController } from './controllers/progress.controller';
import { WordbooksController } from './controllers/wordbooks.controller';
import { HealthController } from './controllers/health.controller';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';

// Interceptors
import { RequestLoggingInterceptor } from './interceptors/request-logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';

// Filters
import { GlobalExceptionFilter } from './filters/global-exception.filter';

// Application Module (for Use Cases)
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    PassportModule,
    ApplicationModule,
  ],
  controllers: [
    AuthController,
    UsersController,
    ProgressController,
    WordbooksController,
    HealthController,
  ],
  providers: [
    // Strategies
    JwtStrategy,
    
    // Guards
    JwtAuthGuard,
    RoleGuard,
    
    // Interceptors
    RequestLoggingInterceptor,
    TransformInterceptor,
    
    // Filters
    GlobalExceptionFilter,
  ],
  exports: [
    JwtAuthGuard,
    RoleGuard,
    RequestLoggingInterceptor,
    TransformInterceptor,
    GlobalExceptionFilter,
  ],
})
export class PresentationModule {}
```

### 9. main.ts 업데이트

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './presentation/filters/global-exception.filter';
import { RequestLoggingInterceptor } from './presentation/interceptors/request-logging.interceptor';
import { TransformInterceptor } from './presentation/interceptors/transform.interceptor';
import { setupSwagger } from './presentation/swagger/swagger.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: process.env.NODE_ENV === 'production',
  }));
  
  // Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Global interceptors
  app.useGlobalInterceptors(
    new RequestLoggingInterceptor(),
    new TransformInterceptor(),
  );
  
  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // API prefix
  const apiPrefix = process.env.API_PREFIX || '';
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  // Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🚀 Polarist Backend API running on http://localhost:${port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`);
  }
}

bootstrap();
```

## 패키지 설치

### 필요한 의존성 추가
```bash
npm install @nestjs/swagger swagger-ui-express
npm install @types/swagger-ui-express --save-dev
```

## 테스트 작성

### Controller 테스트 (`src/presentation/controllers/__tests__/`)

#### `users.controller.spec.ts`
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { CreateUserUseCase } from '../../../application/use-cases/users/create-user.use-case';
import { UpdateUserUseCase } from '../../../application/use-cases/users/update-user.use-case';
import { GetUserUseCase } from '../../../application/use-cases/users/get-user.use-case';
import { CreateUserDto } from '../../../application/dtos/users/create-user.dto';
import { UserResponseDto } from '../../../application/dtos/users/user-response.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let createUserUseCase: jest.Mocked<CreateUserUseCase>;
  let updateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let getUserUseCase: jest.Mocked<GetUserUseCase>;

  beforeEach(async () => {
    const mockCreateUserUseCase = {
      execute: jest.fn(),
    };
    
    const mockUpdateUserUseCase = {
      execute: jest.fn(),
    };
    
    const mockGetUserUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
        {
          provide: UpdateUserUseCase,
          useValue: mockUpdateUserUseCase,
        },
        {
          provide: GetUserUseCase,
          useValue: mockGetUserUseCase,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    createUserUseCase = module.get(CreateUserUseCase);
    updateUserUseCase = module.get(UpdateUserUseCase);
    getUserUseCase = module.get(GetUserUseCase);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const createUserDto: CreateUserDto = {
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
        locale: 'en',
      };

      const expectedResponse: UserResponseDto = {
        id: 1,
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
        locale: 'en',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      createUserUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.createUser(createUserDto);

      expect(result).toEqual(expectedResponse);
      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockRequest = {
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
      } as any;

      const expectedResponse: UserResponseDto = {
        id: 1,
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
        locale: 'en',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      getUserUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.getCurrentUser(mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(getUserUseCase.execute).toHaveBeenCalledWith(1);
    });
  });
});
```

## PR 체크리스트

### Controller 리팩토링
- [ ] 모든 컨트롤러가 Use Case를 주입받아 사용
- [ ] 적절한 HTTP 상태 코드 사용
- [ ] Request/Response DTO 타입 안전성
- [ ] API 문서화 (Swagger) 완료

### 인증/인가
- [ ] JWT 기반 인증 구현
- [ ] Role 기반 인가 시스템 구현
- [ ] 토큰 만료 처리
- [ ] 보안 헤더 설정

### 예외 처리
- [ ] 전역 예외 필터 적용
- [ ] 일관된 에러 응답 형식
- [ ] 적절한 로깅 레벨
- [ ] 민감 정보 마스킹

### API 문서화
- [ ] Swagger UI 설정
- [ ] 모든 엔드포인트 문서화
- [ ] 요청/응답 스키마 정의
- [ ] 인증 방법 설명

### 테스트
- [ ] Controller 단위 테스트
- [ ] Guard 및 인터셉터 테스트
- [ ] End-to-End 테스트 준비
- [ ] 에러 시나리오 테스트

## 다음 단계 준비사항

1. **Module 통합**: 모든 모듈을 app.module.ts에서 통합
2. **Environment 설정**: 환경별 설정 파일 분리
3. **Performance 최적화**: 응답 시간 및 메모리 사용량 최적화

## 예상 작업 시간

- **Controller 리팩토링**: 2일
- **Guard 및 Strategy 개선**: 1일
- **인터셉터 및 필터**: 1일
- **Swagger 설정**: 0.5일
- **단위 테스트 작성**: 2일
- **통합 테스트**: 1일
- **문서화**: 0.5일

**총 예상 시간**: 8일

이 단계를 완료하면 Clean Architecture가 완전히 적용된 NestJS 백엔드가 구축되며, 타입 안전한 API와 종합적인 문서화가 제공됩니다.