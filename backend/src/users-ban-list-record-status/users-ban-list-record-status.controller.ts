import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersBanListRecordStatusService } from './users-ban-list-record-status.service';

@ApiTags('Users ban list record statuses')
@Controller('users-ban-list-record-statuses')
export class UsersBanListRecordStatusController {
  constructor(private readonly userBanListRecordStatusService: UsersBanListRecordStatusService) {}
}
