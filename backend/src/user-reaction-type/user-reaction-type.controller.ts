import { Controller } from '@nestjs/common';
import { UserReactionTypeService } from './user-reaction-type-service';

@Controller('user-reaction-types')
export class UserReactionTypeController {
  constructor(private readonly userReactionTypeService: UserReactionTypeService) {}
}
