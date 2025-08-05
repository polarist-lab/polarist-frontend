import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthAdapter } from '../google-auth.adapter';
import { ExternalServiceException } from '../../../shared/exceptions/infrastructure.exception';

// Mock fetch globally
global.fetch = jest.fn();

describe('GoogleAuthAdapter', () => {
  let adapter: GoogleAuthAdapter;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleAuthAdapter,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    adapter = module.get<GoogleAuthAdapter>(GoogleAuthAdapter);
    configService = module.get(ConfigService);

    jest.clearAllMocks();
  });

  describe('verifyIdToken', () => {
    it('should verify token successfully', async () => {
      const mockTokenInfo = {
        sub: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockTokenInfo),
      });

      const result = await adapter.verifyIdToken('valid-token');

      expect(result).toEqual({
        id: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      });
    });

    it('should throw ExternalServiceException for invalid token', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(adapter.verifyIdToken('invalid-token'))
        .rejects.toThrow(ExternalServiceException);
    });

    it('should throw ExternalServiceException on network error', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(adapter.verifyIdToken('token'))
        .rejects.toThrow(ExternalServiceException);
    });
  });

  describe('validateGoogleUser', () => {
    it('should validate complete user info', () => {
      const userInfo = {
        id: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      };

      const result = adapter.validateGoogleUser(userInfo);

      expect(result).toEqual({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
      });
    });

    it('should throw ExternalServiceException for incomplete info', () => {
      const incompleteUserInfo = {
        id: 'google-123',
        email: 'test@example.com',
        // missing name
      };

      expect(() => adapter.validateGoogleUser(incompleteUserInfo as any))
        .toThrow(ExternalServiceException);
    });
  });
});