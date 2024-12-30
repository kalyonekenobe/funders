import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenPayload } from 'src/core/types/auth.types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request.headers.authorization?.replace('Bearer ', '') ??
          request.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtTokenPayload): Promise<UserPublicEntity> {
    return this.userService.findById(payload.userId);
  }
}
