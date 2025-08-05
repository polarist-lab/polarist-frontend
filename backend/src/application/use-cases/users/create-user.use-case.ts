import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../../dtos/users/create-user.dto';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { ApplicationException } from '../../../shared/exceptions/application.exception';
import { Email } from '../../../domain/value-objects/email.vo';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByGoogleId(dto.googleId);
    if (existingUser) {
      throw new ApplicationException('User already exists');
    }

    // Check if email is already in use
    const emailVo = Email.from(dto.email);
    const existingEmailUser = await this.userRepository.findByEmail(emailVo);
    if (existingEmailUser) {
      throw new ApplicationException('Email already in use');
    }

    // Create new user
    const user = User.create({
      googleId: dto.googleId,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
      locale: dto.locale,
    });

    const savedUser = await this.userRepository.save(user);
    return UserResponseDto.fromEntity(savedUser);
  }
}