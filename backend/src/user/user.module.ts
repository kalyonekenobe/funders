import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PasswordModule } from 'src/core/password/password.module';
import { FollowingModule } from 'src/following/following.module';
import { UserRoleModule } from 'src/user-role/user-role.module';
import { UserReactionTypeModule } from 'src/user-reaction-type/user-reaction-type.module';
import { UserRegistrationMethodModule } from 'src/user-registration-method/user-registration-method.module';
import { UsersBanListRecordModule } from 'src/users-ban-list-record/users-ban-list-record.module';
import { UsersBanListRecordStatusModule } from 'src/users-ban-list-record-status/users-ban-list-record-status.module';
import { PostModule } from 'src/post/post.module';
import { CloudinaryModule } from 'src/core/cloudinary/cloudinary.module';
import { PostReactionModule } from 'src/post-reaction/post-reaction.module';

@Module({
  imports: [
    PrismaModule,
    UserRoleModule,
    CloudinaryModule,
    UserReactionTypeModule,
    UserRegistrationMethodModule,
    UsersBanListRecordModule,
    UsersBanListRecordStatusModule,
    FollowingModule,
    PostModule,
    PostReactionModule,
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
