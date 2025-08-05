import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { GoogleLoginDto } from '../../dtos/auth/google-login.dto';
import { AuthResponseDto } from '../../dtos/auth/auth-response.dto';
import { UserResponseDto } from '../../dtos/users/user-response.dto';
import { ApplicationException } from '../../../shared/exceptions/application.exception';
import { JwtService } from '@nestjs/jwt';
import { Email } from '../../../domain/value-objects/email.vo';

@Injectable()
export class GoogleSignupUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: GoogleLoginDto, guestId?: string): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByGoogleId(dto.googleId);
    if (existingUser) {
      throw new ApplicationException('Account already exists');
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
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = { sub: savedUser.id, email: savedUser.email.value };
    const accessToken = this.jwtService.sign(payload);

    // TODO: Migrate guest data if guestId provided
    let guestDataMigrated = false;
    if (guestId) {
      guestDataMigrated = await this.migrateGuestData(savedUser.id!, guestId);
    }

    return {
      user: UserResponseDto.fromEntity(savedUser),
      accessToken,
      isNewUser: true,
      guestDataMigrated,
    };
  }

  private async migrateGuestData(userId: number, guestId: string): Promise<boolean> {
    // TODO: Implement guest data migration logic
    console.log(`Migrating guest data from ${guestId} to user ${userId}`);
    return true;
  }
}