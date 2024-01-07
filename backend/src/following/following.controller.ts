import { Controller, Get } from '@nestjs/common';
import { FollowingService } from './following.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) {}
}
