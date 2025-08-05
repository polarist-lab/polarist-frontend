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