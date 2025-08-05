import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleLoginDto } from '../../application/dtos/auth/google-login.dto';
import { ExternalServiceException } from '../../shared/exceptions/infrastructure.exception';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable()
export class GoogleAuthAdapter {
  constructor(private readonly configService: ConfigService) {}

  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      // In a real implementation, you would verify the ID token with Google
      // This is a simplified version for demonstration
      
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
      
      if (!response.ok) {
        throw new Error('Invalid token');
      }
      
      const tokenInfo = await response.json();
      
      return {
        id: tokenInfo.sub,
        email: tokenInfo.email,
        name: tokenInfo.name,
        picture: tokenInfo.picture,
      };
    } catch (error) {
      throw new ExternalServiceException('Google Auth', error as Error);
    }
  }

  validateGoogleUser(userInfo: GoogleUserInfo): GoogleLoginDto {
    if (!userInfo.id || !userInfo.email || !userInfo.name) {
      throw new ExternalServiceException('Google Auth', new Error('Incomplete user information'));
    }

    return {
      googleId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      avatar: userInfo.picture,
    };
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      
      return {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      };
    } catch (error) {
      throw new ExternalServiceException('Google Auth', error as Error);
    }
  }
}