import { Controller } from '@nestjs/common';
import { UsersBanListRecordService } from './users-ban-list-record.service';

@Controller('users-ban-list-records')
export class UsersBanListRecordController {
  constructor(private readonly usersBanListRecordService: UsersBanListRecordService) {}
}
