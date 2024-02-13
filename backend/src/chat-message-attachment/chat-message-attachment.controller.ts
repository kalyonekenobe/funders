import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatMessageAttachmentService } from './chat-message-attachment.service';

@ApiTags('Chat message attachments')
@Controller('message-attachments')
export class ChatMessageAttachmentController {
  constructor(private readonly chatMessageAttachmentService: ChatMessageAttachmentService) {}
}
