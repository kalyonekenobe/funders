import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardOptions } from 'src/core/types/auth.types';

@Injectable()
export class MockAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly options?: AuthGuardOptions) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
  }
}
