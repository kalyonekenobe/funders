import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './core/logging/logging.middleware';
import { UserModule } from './user/user.module';
import { UsersBanListRecordStatusModule } from './users-ban-list-record-status/users-ban-list-record-status.module';
import { UsersBanListRecordModule } from './users-ban-list-record/users-ban-list-record.module';
import { PostCategoryModule } from './post-category/post-category.module';
import { ChatRoleModule } from './chat-role/chat-role.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    UserModule,
    UsersBanListRecordModule,
    UsersBanListRecordStatusModule,
    PostCategoryModule,
    ChatModule,
    ChatRoleModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
