import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { UserReactionTypeController } from './user-reaction-type.controller';
import { UserReactionTypeService } from './user-reaction-type.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserReactionTypeController],
  providers: [UserReactionTypeService],
  exports: [UserReactionTypeService],
})
export class UserReactionTypeModule {}
