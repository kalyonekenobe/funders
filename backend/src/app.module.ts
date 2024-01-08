import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './core/logging/logging.middleware';
import { UserModule } from './user/user.module';
import { PostCategoryModule } from './post-category/post-category.module';
import { ChatRoleModule } from './chat-role/chat-role.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UserModule, PostCategoryModule, ChatModule, ChatRoleModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
