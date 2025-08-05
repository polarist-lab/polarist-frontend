import { 
  IsString, 
  IsNotEmpty, 
  IsEmail, 
  IsOptional, 
  MinLength, 
  MaxLength,
  IsIn 
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsIn(['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'])
  locale?: string;
}