import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatsOnUsersService } from './chats-on-users.service';

@Controller('chats')
export class ChatsOnUsersController {
  constructor(private readonly chatsOnUsersService: ChatsOnUsersService) {}
}
