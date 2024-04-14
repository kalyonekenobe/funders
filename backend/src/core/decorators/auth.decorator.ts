import { AuthGuardOptions } from '../types/auth.types';
import { CanActivate, UseGuards } from '@nestjs/common';

export const Auth = (guard: Function | CanActivate, options?: AuthGuardOptions) => {
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<unknown>) => {
    const guardInstance = guard instanceof Function ? new (guard as any)(options) : guard;
    UseGuards(guardInstance)(target, key, descriptor);
  };
};
