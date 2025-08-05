import { Injectable, Inject } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { UpdateUserDto } from '../../dtos/users/update-user.dto';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { EntityNotFoundDomainException } from '../../../shared/exceptions/domain.exception';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundDomainException('User', userId);
    }

    // Update profile if name or avatar provided
    if (dto.name !== undefined || dto.avatar !== undefined) {
      user.updateProfile(dto.name || user.name, dto.avatar);
    }

    // Update locale if provided
    if (dto.locale !== undefined) {
      user.changeLocale(dto.locale);
    }

    const updatedUser = await this.userRepository.update(user);
    return UserResponseDto.fromEntity(updatedUser);
  }
}