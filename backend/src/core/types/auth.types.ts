import { UserPublicEntity } from 'src/user/entities/user-public.entity';

export interface LoginResponse extends UserPublicEntity {
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

export interface RegisterResponse extends UserPublicEntity {
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtTokensPairResponse {
  accessToken: string;
  refreshToken: string;
}

export interface JwtTokenPayload {
  userId: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

export interface AuthGuardOptions {
  permissions?: number;
}
