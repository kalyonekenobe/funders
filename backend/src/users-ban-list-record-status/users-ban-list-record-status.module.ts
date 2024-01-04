import { Module } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UsersBanListRecordStatusService } from './users-ban-list-record-status.service';
import { UsersBanListRecordStatusController } from './users-ban-list-record-status.controller';

@Module({
  imports: [PrismaService],
  controllers: [UsersBanListRecordStatusController],
  providers: [UsersBanListRecordStatusService],
  exports: [UsersBanListRecordStatusService],
})
export class UsersBanListRecordStatusModule {}
