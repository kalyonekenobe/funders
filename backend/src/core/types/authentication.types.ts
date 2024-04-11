import { LocalAuthenticationGuard } from '../authentication/guards/local-authentication.guard';

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  [key: string]: any;
}

export interface AuthGuardOptions {
  permissions?: number;
}
