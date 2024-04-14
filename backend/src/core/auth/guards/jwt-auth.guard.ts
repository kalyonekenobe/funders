import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardOptions } from 'src/core/types/auth.types';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly options?: AuthGuardOptions) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const canBeActivated = await super.canActivate(context);

      if (!canBeActivated) {
        return false;
      }

      if (!this.options) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const permissions = this.options.permissions ?? 0;

      return (Number(request.user.userRole?.permissions ?? 0) & permissions) === permissions;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new ForbiddenException();
    }
  }
}
