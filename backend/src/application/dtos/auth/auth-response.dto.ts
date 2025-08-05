import { UserResponseDto } from '../users/user-response.dto';

export class AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
  isNewUser?: boolean;
  guestDataMigrated?: boolean;
}

export class AuthErrorResponseDto {
  reason: 'account_exists' | 'account_not_found' | 'signup_failed' | 'login_failed';
  message: string;
}