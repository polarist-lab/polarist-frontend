import { Injectable, Inject } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { EntityNotFoundDomainException } from '../../../shared/exceptions/domain.exception';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new EntityNotFoundDomainException('User', userId);
    }

    return UserResponseDto.fromEntity(user);
  }
}