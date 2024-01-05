import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { UsersBanListRecordController } from './users-ban-list-record.controller';
import { UsersBanListRecordService } from './users-ban-list-record.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersBanListRecordController],
  providers: [UsersBanListRecordService],
  exports: [UsersBanListRecordService],
})
export class UsersBanListRecordModule {}
