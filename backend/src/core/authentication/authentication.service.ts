import { Injectable } from '@nestjs/common';
import { PasswordService } from '../password/password.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticationException } from '../exceptions/authentication.exception';
import { JwtService } from '@nestjs/jwt';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { SignInResponse } from '../types/authentication.types';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserPublicEntity> {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({ where: { email } });
      const passwordIsCorrect = await this.passwordService.compare(password, user.password);

      if (!passwordIsCorrect) {
        throw new AuthenticationException(
          'The password was provided for the requested user is incorrect.',
        );
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error: unknown) {
      if (error instanceof AuthenticationException) {
        throw error;
      }

      throw new AuthenticationException('The user with requested credentials does not exist.');
    }
  }

  async signIn(user: UserPublicEntity): Promise<SignInResponse> {
    return {
      ...user,
      accessToken: this.jwtService.sign({
        userId: user.id,
        permissions: user.userRole?.permissions,
      }),
      refreshToken: '',
    };
  }
}
