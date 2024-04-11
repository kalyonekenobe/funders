import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationService } from '../authentication.service';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super();
  }

  async validate(email: string, password: string): Promise<UserPublicEntity> {
    console.log(email);
    return await this.authenticationService.validateUser(email, password);
  }
}
