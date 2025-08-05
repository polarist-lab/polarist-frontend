import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

// Core Modules
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ApplicationModule } from './application/application.module';
import { PresentationModule } from './presentation/presentation.module';

// Global Providers
import { GlobalExceptionFilter } from './presentation/filters/global-exception.filter';
import { RequestLoggingInterceptor } from './presentation/interceptors/request-logging.interceptor';
import { TransformInterceptor } from './presentation/interceptors/transform.interceptor';
import { ValidationPipe } from './shared/pipes/validation.pipe';

// Configuration
import databaseConfig from './infrastructure/config/database.config';
import authConfig from './infrastructure/config/auth.config';
import appConfig from './infrastructure/config/app.config';

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig],
      envFilePath: ['.env.local', '.env'],
      cache: true,
      expandVariables: true,
    }),

    // Core Architecture Layers
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
  ],
  providers: [
    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    
    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    
    // Global Validation Pipe
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}