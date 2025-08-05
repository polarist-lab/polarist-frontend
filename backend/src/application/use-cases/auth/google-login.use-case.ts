import { Injectable, Inject } from '@nestjs/common';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { GoogleLoginDto } from '../../dtos/auth/google-login.dto';
import { AuthResponseDto } from '../../dtos/auth/auth-response.dto';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { ApplicationException } from '../../../shared/exceptions/application.exception';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: GoogleLoginDto): Promise<AuthResponseDto> {
    // Find existing user
    const user = await this.userRepository.findByGoogleId(dto.googleId);
    if (!user) {
      throw new ApplicationException('Account not found');
    }

    // Update user info
    user.updateProfile(dto.name, dto.avatar);
    const updatedUser = await this.userRepository.update(user);

    // Generate JWT token
    const payload = { sub: updatedUser.id, email: updatedUser.email.value };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: UserResponseDto.fromEntity(updatedUser),
      accessToken,
    };
  }
}