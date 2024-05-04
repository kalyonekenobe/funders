import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { UserRegistrationMethod } from '../types/user.types';
import { AuthException } from '../exceptions/auth.exception';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Auth(JwtAuthGuard)
  @ApiOkResponse({
    description: 'The authenticated user.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Get('/user')
  async user(@Req() request: Request) {
    return request.user;
  }

  @ApiCreatedResponse({
    description: 'User was successfully registered.',
    type: UserPublicEntity,
  })
  @ApiConflictResponse({
    description: 'Cannot register the user. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    const user = await this.authService.register(createUserDto);

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @ApiCreatedResponse({
    description: 'User was successfully logged in.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'Cannot log in the user.',
  })
  @ApiConflictResponse({
    description: 'Cannot log in the user. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    const user = await this.authService.login(loginDto);

    if (user.registrationMethod !== UserRegistrationMethod.Default) {
      throw new AuthException('The user with provided credentials does not exist');
    }

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @Auth(JwtRefreshAuthGuard)
  @ApiCreatedResponse({
    description: 'User refresh and access tokens were successfully updated.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiConflictResponse({
    description: "Cannot update user's refresh and access tokens. Invalid data was provided.",
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post('/refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    const { accessToken, refreshToken } = await this.authService.refresh({
      refreshToken:
        request.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token'],
    });

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token', accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token', refreshToken, {
        httpOnly: true,
      })
      .json({ accessToken, refreshToken });
  }

  @Auth(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'The user was successfully logged out.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is unauthorized.',
  })
  @ApiForbiddenResponse({
    description: 'The user is forbidden to perform this action.',
  })
  @ApiConflictResponse({
    description: 'Cannot log out the user. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const user = await this.authService.logout({ userId: (request.user as UserPublicEntity)?.id });

    return response
      .status(HttpStatus.CREATED)
      .clearCookie(process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token', {
        httpOnly: true,
      })
      .clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token', {
        httpOnly: true,
      })
      .json(user);
  }

  @ApiCreatedResponse({
    description: 'User was successfully logged in with Google.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'Cannot log in the user with Google.',
  })
  @ApiConflictResponse({
    description: 'Cannot log in the user with Google. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post('/login/google')
  async googleLogin(@Req() request: Request, @Res() response: Response) {
    const user = await this.authService.googleLogin(
      (request.headers.authorization ?? '').replace('Bearer ', ''),
    );

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }

  @ApiCreatedResponse({
    description: 'User was successfully logged in with Discord.',
    type: UserPublicEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'Cannot log in the user with Discord.',
  })
  @ApiConflictResponse({
    description: 'Cannot log in the user with Discord. Invalid data was provided.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error was occured.',
  })
  @Post('/login/discord')
  async discordLogin(@Req() request: Request, @Res() response: Response) {
    const user = await this.authService.discordLogin(
      (request.headers.authorization ?? '').replace('Bearer ', ''),
    );

    return response
      .status(HttpStatus.CREATED)
      .cookie(process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token', user.accessToken, {
        httpOnly: true,
      })
      .cookie(process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token', user.refreshToken, {
        httpOnly: true,
      })
      .json(user);
  }
}
