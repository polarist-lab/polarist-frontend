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