import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from './core/logging/logging.middleware';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { PostModule } from './post/post.module';
import { StripeModule } from './core/stripe/stripe.module';

@Module({
  imports: [
    UserModule,
    PostModule,
    ChatModule,
    StripeModule.forRootAsync({
      useFactory: () => ({
        apiKey: process.env.STRIPE_API_KEY,
        options: {
          apiVersion: '2023-10-16',
        },
      }),
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
