import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenPayload } from 'src/core/types/auth.types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtTokenPayload): Promise<UserPublicEntity> {
    const refreshToken =
      request.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME ?? 'Funders-Refresh-Token'];
    return await this.userService.findOne({ id: payload.userId.toString(), refreshToken });
  }
}
