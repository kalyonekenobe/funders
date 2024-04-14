import { Injectable } from '@nestjs/common';
import { PasswordService } from '../password/password.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthException } from '../exceptions/auth.exception';
import { JwtService } from '@nestjs/jwt';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import {
  JwtTokensPairResponse,
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
} from '../types/auth.types';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserPublicEntity> {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({ where: { email } });
      const passwordIsCorrect = await this.passwordService.compare(password, user.password);

      if (!passwordIsCorrect) {
        throw new AuthException('The password was provided for the requested user is incorrect.');
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error: unknown) {
      if (error instanceof AuthException) {
        throw error;
      }

      throw new AuthException('The user with requested credentials does not exist.');
    }
  }

  async register(data: CreateUserDto): Promise<RegisterResponse> {
    const user = await this.userService.create(data);
    const { accessToken, refreshToken } = await this.generateJwtTokensPair(user);

    await this.userService.update(user.id, { refreshToken });

    return { ...user, accessToken, refreshToken };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const { accessToken, refreshToken } = await this.generateJwtTokensPair(user);

    await this.userService.update(user.id, { refreshToken });

    return { ...user, accessToken, refreshToken };
  }

  async refresh(refreshDto: RefreshDto): Promise<RefreshResponse> {
    const userWithValidRefreshToken = await this.userService.findOne({
      refreshToken: refreshDto.refreshToken,
    });
    const { accessToken, refreshToken } =
      await this.generateJwtTokensPair(userWithValidRefreshToken);

    await this.userService.update(userWithValidRefreshToken.id, { refreshToken });

    return { accessToken, refreshToken };
  }

  async logout(logoutDto: LogoutDto): Promise<UserPublicEntity> {
    return this.userService.update(logoutDto.userId, { refreshToken: null });
  }

  private async generateJwtTokensPair(user: UserPublicEntity): Promise<JwtTokensPairResponse> {
    const accessToken = this.jwtService.sign({
      userId: user.id,
      permissions: Number(user.userRole?.permissions ?? 0),
    });

    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
        permissions: Number(user.userRole?.permissions ?? 0),
      },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION },
    );

    return { accessToken, refreshToken };
  }
}
