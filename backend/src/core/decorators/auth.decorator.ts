import { Reflector } from '@nestjs/core';
import { AuthGuardOptions } from '../types/authentication.types';

export const Auth = Reflector.createDecorator<AuthGuardOptions>();
