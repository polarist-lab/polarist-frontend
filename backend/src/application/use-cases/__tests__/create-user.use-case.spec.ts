import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '../users/create-user.use-case';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../dtos/users/create-user.dto';
import { User } from '../../../domain/entities/user.entity';
import { ApplicationException } from '../../../shared/exceptions/application.exception';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByGoogleId: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get(USER_REPOSITORY);
  });

  describe('execute', () => {
    const validDto: CreateUserDto = {
      googleId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      locale: 'en',
    };

    it('should create user successfully', async () => {
      userRepository.findByGoogleId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      
      const savedUser = User.create(validDto);
      savedUser.setId(1);
      userRepository.save.mockResolvedValue(savedUser);

      const result = await useCase.execute(validDto);

      expect(result.id).toBe(1);
      expect(result.email).toBe(validDto.email);
      expect(result.name).toBe(validDto.name);
      expect(userRepository.findByGoogleId).toHaveBeenCalledWith(validDto.googleId);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      const existingUser = User.create(validDto);
      userRepository.findByGoogleId.mockResolvedValue(existingUser);

      await expect(useCase.execute(validDto)).rejects.toThrow(ApplicationException);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error if email is already in use', async () => {
      userRepository.findByGoogleId.mockResolvedValue(null);
      
      const existingUser = User.create({
        ...validDto,
        googleId: 'different-google-id',
      });
      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(useCase.execute(validDto)).rejects.toThrow(ApplicationException);
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});