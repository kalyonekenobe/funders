import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PasswordModule } from 'src/core/password/password.module';
import { FollowingModule } from 'src/following/following.module';

@Module({
  imports: [
    PrismaModule,
    FollowingModule,
    PasswordModule.forRoot(
      process.env.USER_PASSWORD_SALT_PREFIX ?? '',
      process.env.USER_PASSWORD_SALT_SUFFIX ?? '',
    ),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
