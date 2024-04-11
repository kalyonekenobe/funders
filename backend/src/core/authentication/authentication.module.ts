import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PasswordModule } from '../password/password.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PrismaModule,
    PasswordModule.forRoot(
      process.env.USER_PASSWORD_SALT_PREFIX ?? '',
      process.env.USER_PASSWORD_SALT_SUFFIX ?? '',
    ),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION,
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
