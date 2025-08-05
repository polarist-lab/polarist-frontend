import { Request } from 'express';
import { UserResponseDto } from '../../application/dtos/users/user-response.dto';

export interface AuthenticatedRequest extends Request {
  user: UserResponseDto & {
    id: number;
    role?: string;
  };
}

export interface GoogleAuthRequest extends Request {
  user: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string;
    intent?: 'signup' | 'login';
  };
}