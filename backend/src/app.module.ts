import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './core/logging/logging.middleware';
import { UserModule } from './user/user.module';
import { UserRegistrationMethodModule } from './user-registration-method/user-registration-method.module';
import { UserRoleModule } from './user-role/user-role.module';
import { UsersBanListRecordStatusModule } from './users-ban-list-record-status/users-ban-list-record-status.module';
import { UsersBanListRecordModule } from './users-ban-list-record/users-ban-list-record.module';
import { UserReactionTypeModule } from './user-reaction-type/user-reaction-type.module';

@Module({
  imports: [
    UserModule,
    UserRoleModule,
    UserReactionTypeModule,
    UserRegistrationMethodModule,
    UsersBanListRecordModule,
    UsersBanListRecordStatusModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
