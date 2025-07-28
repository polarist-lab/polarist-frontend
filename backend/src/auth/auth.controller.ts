import { Controller, Get, UseGuards, Req, Res, Post, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Mock login for testing (remove in production)
  @Get('mock-login')
  async mockLogin(@Res() res: Response) {
    const mockUser = {
      googleId: 'mock-google-id-123',
      email: 'test@example.com',
      name: '테스트 사용자',
      avatar: 'https://via.placeholder.com/32',
    };

    const { user, accessToken } = await this.authService.googleLogin(mockUser);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
  }

  // Google OAuth for Signup
  @Get('google/signup')
  @UseGuards(AuthGuard('google-signup'))
  async googleSignup(@Query('guest_id') guestId?: string) {
    // OAuth 시작 with signup intent
    // guest_id는 Passport strategy에서 사용하기 위해 session에 저장
  }

  @Get('google/signup/redirect')
  @UseGuards(AuthGuard('google-signup'))
  async googleSignupCallback(@Req() req: any, @Res() res: Response) {
    try {
      const { user, accessToken, isNewUser, guestDataMigrated } = await this.authService.handleGoogleSignup(req.user, req.session?.guestId);
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      if (isNewUser) {
        // 새 사용자 생성 성공
        res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}&new_user=true&migrated=${guestDataMigrated}`);
      } else {
        // 계정이 이미 존재함 - 에러 페이지로 리다이렉트
        res.redirect(`${frontendUrl}/auth/error?reason=account_exists`);
      }
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/error?reason=signup_failed`);
    }
  }

  // Google OAuth for Sign In
  @Get('google/signin')
  @UseGuards(AuthGuard('google-login'))
  async googleSignin() {
    // OAuth 시작 with signin intent
  }

  @Get('google/signin/redirect')
  @UseGuards(AuthGuard('google-login'))
  async googleSigninCallback(@Req() req: any, @Res() res: Response) {
    try {
      const { user, accessToken, accountExists } = await this.authService.handleGoogleLogin(req.user);
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      if (accountExists) {
        // 기존 사용자 로그인 성공
        res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}`);
      } else {
        // 계정이 존재하지 않음 - 에러 페이지로 리다이렉트
        res.redirect(`${frontendUrl}/auth/error?reason=account_not_found`);
      }
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/error?reason=login_failed`);
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: any) {
    return {
      user: req.user,
      message: 'User profile retrieved successfully',
    };
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.json({ message: 'Logged out successfully' });
  }

  // Guest data migration API
  @Post('migrate-guest-data')
  @UseGuards(AuthGuard('jwt'))
  async migrateGuestData(@Req() req: any, @Query('guest_id') guestId: string) {
    try {
      const success = await this.authService.migrateGuestData(req.user.id, guestId);
      return { success, message: success ? 'Guest data migrated successfully' : 'No guest data found' };
    } catch (error: unknown) {
      return { success: false, message: 'Migration failed', error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}