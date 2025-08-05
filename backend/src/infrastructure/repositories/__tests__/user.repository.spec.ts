import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleUserRepository } from '../user.repository';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { DatabaseException } from '../../../shared/exceptions/infrastructure.exception';

describe('DrizzleUserRepository', () => {
  let repository: DrizzleUserRepository;
  let databaseService: jest.Mocked<DatabaseService>;

  beforeEach(async () => {
    const mockDatabaseService = {
      db: {
        select: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DrizzleUserRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    repository = module.get<DrizzleUserRepository>(DrizzleUserRepository);
    databaseService = module.get(DatabaseService);
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockDbUser = {
        id: 1,
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
        locale: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([mockDbUser]),
      };

      databaseService.db.select.mockReturnValue(mockQuery);

      const result = await repository.findById(1);

      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(1);
      expect(result?.email.value).toBe('test@example.com');
    });

    it('should return null when user not found', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };

      databaseService.db.select.mockReturnValue(mockQuery);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });

    it('should throw DatabaseException on database error', async () => {
      const mockQuery = {
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      databaseService.db.select.mockReturnValue(mockQuery);

      await expect(repository.findById(1)).rejects.toThrow(DatabaseException);
    });
  });

  describe('save', () => {
    it('should save user successfully', async () => {
      const user = User.create({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
      });

      const mockDbUser = {
        id: 1,
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
        locale: 'en',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockQuery = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([mockDbUser]),
      };

      databaseService.db.insert.mockReturnValue(mockQuery);

      const result = await repository.save(user);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(databaseService.db.insert).toHaveBeenCalled();
    });

    it('should throw DatabaseException on save error', async () => {
      const user = User.create({
        googleId: 'google-123',
        email: 'test@example.com',
        name: 'Test User',
      });

      const mockQuery = {
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockRejectedValue(new Error('Save failed')),
      };

      databaseService.db.insert.mockReturnValue(mockQuery);

      await expect(repository.save(user)).rejects.toThrow(DatabaseException);
    });
  });
});