import { Controller } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';

@Controller('messages')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}
}
