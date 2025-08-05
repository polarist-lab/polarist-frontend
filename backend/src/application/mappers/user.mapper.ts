import { 
  CreateUserDto, 
  UpdateUserDto, 
  UserResponseDto 
} from '../dtos/users/user-response.dto';
import { 
  CreateUserApiDto, 
  UpdateUserApiDto, 
  UserResponseApiDto 
} from '../dtos/users/user-response.dto';

export class UserDtoMapper {
  static apiToDomain(apiDto: CreateUserApiDto): CreateUserDto {
    return {
      googleId: apiDto.googleId,
      email: apiDto.email,
      name: apiDto.name,
      avatar: apiDto.avatar,
      locale: apiDto.locale,
    };
  }

  static apiUpdateToDomain(apiDto: UpdateUserApiDto): UpdateUserDto {
    return {
      name: apiDto.name,
      avatar: apiDto.avatar,
      locale: apiDto.locale,
    };
  }

  static domainToApi(domainDto: UserResponseDto): UserResponseApiDto {
    return {
      id: domainDto.id,
      googleId: domainDto.googleId,
      email: domainDto.email,
      name: domainDto.name,
      avatar: domainDto.avatar,
      locale: domainDto.locale,
      createdAt: domainDto.createdAt.toISOString(),
      updatedAt: domainDto.updatedAt.toISOString(),
    };
  }

  static domainListToApi(domainList: UserResponseDto[]): UserResponseApiDto[] {
    return domainList.map(this.domainToApi);
  }
}