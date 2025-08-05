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