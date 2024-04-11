import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardOptions } from 'src/core/types/authentication.types';

export class LocalAuthenticationGuard extends AuthGuard('local') {u
  constructor(private readonly options?: AuthGuardOptions) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const x = await super.canActivate(context);
      console.log(x);
      if (!x) return false;
      if (!this.options) return true;

      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const permissions = this.options?.permissions ?? 0;

      return (user.permissions & permissions) === permissions;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) throw error;
      throw new ForbiddenException();
    }
  }
}
