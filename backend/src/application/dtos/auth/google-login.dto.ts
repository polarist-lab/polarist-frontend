import { IsString, IsNotEmpty, IsEmail, IsOptional, IsIn } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsIn(['signup', 'login'])
  intent?: 'signup' | 'login';
}

export class MigrateGuestDataDto {
  @IsString()
  @IsNotEmpty()
  guestId: string;
}