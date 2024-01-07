import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { FollowingController } from './following.controller';
import { FollowingService } from './following.service';

@Module({
  imports: [PrismaModule],
  controllers: [FollowingController],
  providers: [FollowingService],
  exports: [FollowingService],
})
export class FollowingModule {}
