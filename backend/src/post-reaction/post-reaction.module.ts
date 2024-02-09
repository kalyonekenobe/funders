import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PostReactionController } from './post-reaction.controller';
import { PostReactionService } from './post-reaction.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostReactionController],
  providers: [PostReactionService],
  exports: [PostReactionService],
})
export class PostReactionModule {}
