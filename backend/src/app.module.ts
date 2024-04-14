import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './core/logging/logging.middleware';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [UserModule, PostModule, ChatModule, AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
