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