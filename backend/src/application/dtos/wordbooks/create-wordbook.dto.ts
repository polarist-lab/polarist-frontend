import { 
  IsString, 
  IsNotEmpty, 
  IsArray, 
  IsOptional, 
  IsBoolean,
  ArrayNotEmpty,
  MaxLength,
  ArrayMaxSize 
} from 'class-validator';

export class CreateWordbookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  wordIds: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(3)
  difficulties?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}