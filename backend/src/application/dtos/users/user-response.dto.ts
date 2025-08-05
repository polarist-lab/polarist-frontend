export class UserResponseDto {
  id: number;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  locale: string;
  createdAt: string;
  updatedAt: string;

  static fromEntity(user: any): UserResponseDto {
    return {
      id: user.id,
      googleId: user.googleId,
      email: typeof user.email === 'string' ? user.email : user.email.value,
      name: user.name,
      avatar: user.avatar,
      locale: user.locale,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}