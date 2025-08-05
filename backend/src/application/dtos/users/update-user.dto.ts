import { 
  IsString, 
  IsOptional, 
  MinLength, 
  MaxLength,
  IsIn 
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsIn(['en', 'ko', 'ja', 'zh', 'id', 'th', 'vi', 'ar', 'es', 'hi', 'pt'])
  locale?: string;
}