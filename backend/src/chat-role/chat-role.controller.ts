import { Controller } from '@nestjs/common';
import { ChatRoleService } from './chat-role.service';

@Controller('chat-roles')
export class ChatRoleController {
  constructor(private readonly chatRoleService: ChatRoleService) {}
}
