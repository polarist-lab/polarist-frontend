import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Database
import { DatabaseModule } from './database/database.module';

// Repositories
import { DrizzleUserRepository } from './repositories/user.repository';
import { DrizzleProgressRepository } from './repositories/progress.repository';
import { DrizzleWordbookRepository } from './repositories/wordbook.repository';

// Repository Tokens
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';
import { PROGRESS_REPOSITORY } from '../domain/repositories/progress.repository.interface';
import { WORDBOOK_REPOSITORY } from '../domain/repositories/wordbook.repository.interface';

// External Services
import { GoogleAuthAdapter } from './external/google-auth.adapter';
import { JwtAdapter } from './external/jwt.adapter';

// Configurations
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(appConfig),
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'default-secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [
    // Repository Implementations
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
    {
      provide: PROGRESS_REPOSITORY,
      useClass: DrizzleProgressRepository,
    },
    {
      provide: WORDBOOK_REPOSITORY,
      useClass: DrizzleWordbookRepository,
    },

    // External Service Adapters
    GoogleAuthAdapter,
    JwtAdapter,
  ],
  exports: [
    // Repository Tokens
    USER_REPOSITORY,
    PROGRESS_REPOSITORY,
    WORDBOOK_REPOSITORY,

    // External Service Adapters
    GoogleAuthAdapter,
    JwtAdapter,

    // Database Module
    DatabaseModule,
  ],
})
export class InfrastructureModule {}