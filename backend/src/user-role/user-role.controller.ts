import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRoleService } from './user-role.service';

@ApiTags('User roles')
@Controller('user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}
}
