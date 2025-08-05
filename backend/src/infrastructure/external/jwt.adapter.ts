import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExternalServiceException } from '../../shared/exceptions/infrastructure.exception';

export interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAdapter {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: { userId: number; email: string }): string {
    try {
      const jwtPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
        sub: payload.userId,
        email: payload.email,
      };

      return this.nestJwtService.sign(jwtPayload);
    } catch (error) {
      throw new ExternalServiceException('JWT Service', error as Error);
    }
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return this.nestJwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new ExternalServiceException('JWT Service', error as Error);
    }
  }

  generateRefreshToken(payload: { userId: number }): string {
    try {
      const refreshPayload = {
        sub: payload.userId,
        type: 'refresh',
      };

      return this.nestJwtService.sign(refreshPayload, {
        expiresIn: '30d',
      });
    } catch (error) {
      throw new ExternalServiceException('JWT Service', error as Error);
    }
  }

  verifyRefreshToken(token: string): { userId: number } {
    try {
      const payload = this.nestJwtService.verify(token);
      
      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return { userId: payload.sub };
    } catch (error) {
      throw new ExternalServiceException('JWT Service', error as Error);
    }
  }

  getTokenExpirationTime(token: string): Date | null {
    try {
      const payload = this.nestJwtService.decode(token) as JwtPayload;
      return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  }
}