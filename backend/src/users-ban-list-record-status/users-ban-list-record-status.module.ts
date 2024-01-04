import { Module } from '@nestjs/common';
import { UsersBanListRecordStatusService } from './users-ban-list-record-status.service';
import { UsersBanListRecordStatusController } from './users-ban-list-record-status.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersBanListRecordStatusController],
  providers: [UsersBanListRecordStatusService],
  exports: [UsersBanListRecordStatusService],
})
export class UsersBanListRecordStatusModule {}
