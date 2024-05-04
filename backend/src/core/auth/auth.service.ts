import { HttpStatus, Injectable } from '@nestjs/common';
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
import { Auth, google } from 'googleapis';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  private readonly googleOAuth2Client: Auth.OAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  private readonly discordOAuth2Client: Auth.OAuth2Client = new google.auth.OAuth2(
    process.env.DISCORD_CLIENT_ID,
    process.env.DISCORD_CLIENT_SECRET,
  );

  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserPublicEntity> {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
        include: { userRole: true },
      });
      const passwordIsCorrect = await this.passwordService.compare(password, user.password);

      if (!passwordIsCorrect) {
        throw new AuthException(
          'The provided credentials are invalid. Please verify your email and password and try again.',
        );
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error: unknown) {
      if (error instanceof AuthException) {
        throw error;
      }

      throw new AuthException(
        'The provided credentials are invalid. Please verify your email and password and try again.',
      );
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

  async googleLogin(token: string): Promise<LoginResponse> {
    try {
      const { email } = await this.googleOAuth2Client.getTokenInfo(token);

      const user = await this.userService.findByEmail(email ?? '');

      if (user.registrationMethod !== 'Google') {
        throw new AuthException('There are not any users with such email registered with Google');
      }

      const { accessToken, refreshToken } = await this.generateJwtTokensPair(user);

      await this.userService.update(user.id, { refreshToken });

      return { ...user, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }

      throw new AuthException('Cannot authorize the user with provided credentials.');
    }
  }

  async discordLogin(token: string): Promise<LoginResponse> {
    try {
      const response = await this.httpService.axiosRef.get(`https://discordapp.com/api/users/@me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== HttpStatus.OK) {
        throw new AuthException('Cannot fetch the Discord user info with provided access token');
      }

      const { email } = response.data;
      const user = await this.userService.findByEmail(email ?? '');

      if (user.registrationMethod !== 'Discord') {
        throw new AuthException('There are not any users with such email registered with Discord');
      }

      const { accessToken, refreshToken } = await this.generateJwtTokensPair(user);

      await this.userService.update(user.id, { refreshToken });

      return { ...user, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }

      throw new AuthException('Cannot authorize the user with provided credentials.');
    }
  }

  async refresh(refreshDto: RefreshDto): Promise<RefreshResponse> {
    const userWithValidRefreshToken = await this.userService.findOne({
      where: {
        refreshToken: refreshDto.refreshToken,
      },
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
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      permissions: Number(user.userRole?.permissions ?? 0),
    });

    const refreshToken = this.jwtService.sign(
      {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        permissions: Number(user.userRole?.permissions ?? 0),
      },
      { expiresIn: process.env.JWT_REFRESH_TOKEN_DURATION },
    );

    return { accessToken, refreshToken };
  }
}
