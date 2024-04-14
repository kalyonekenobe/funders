import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtTokenPayload } from 'src/core/types/auth.types';
import { MockDataStorage } from 'test/user/user.mock';
import { Permissions } from 'src/user/types/user.types';

@Injectable()
export class MockAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request.headers.authorization?.replace('Bearer ', '') ??
          request.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME ?? 'Funders-Access-Token'],
      ]),
      ignoreExpiration: true,
      secretOrKey:
        process.env.JWT_SECRET ??
        '295da2583ac5770c82b2d717dfba1fb820b5a05fb4bc4c2c6fb4f6bf8ecf0633',
    });
  }

  async validate(payload: JwtTokenPayload): Promise<UserPublicEntity> {
    MockDataStorage.setDefaultItems();
    const user = MockDataStorage.items().find(user => user.id === payload.userId);

    if (!user) {
      throw new Error('The user was not found!');
    }

    return {
      ...user,
      userRole: {
        name: 'Administrator',
        permissions: BigInt(
          Object.values(Permissions).reduce(
            (previousValue: number, currentValue: number) => previousValue | currentValue,
            0,
          ),
        ),
      },
    };
  }
}
