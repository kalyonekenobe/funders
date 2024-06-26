import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockChatMessageService } from './chat-message.mock';
import {
  MockDataStorage as ChatMessageAttachmentMockDataStorage,
  mockChatMessageAttachmentService,
} from '../chat-message-attachment/chat-message-attachment.mock';
import { ChatMessageService } from 'src/chat-message/chat-message.service';
import { ChatMessageController } from 'src/chat-message/chat-message.controller';
import { ChatMessageAttachmentService } from 'src/chat-message-attachment/chat-message-attachment.service';

describe('ChatMessageService', () => {
  let controller: ChatMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMessageController],
      providers: [
        {
          provide: ChatMessageService,
          useValue: mockChatMessageService,
        },
        {
          provide: ChatMessageAttachmentService,
          useValue: mockChatMessageAttachmentService,
        },
      ],
    }).compile();

    controller = module.get<ChatMessageController>(ChatMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find chat messages list by ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageService.findById).toHaveBeenCalled();
  });

  it('should find all chat message attachments by chat message id', async () => {
    ChatMessageAttachmentMockDataStorage.setDefaultItems();

    const initialItems = [...ChatMessageAttachmentMockDataStorage.items()];
    expect(
      await controller.findAllChatMessageAttachments(
        ChatMessageAttachmentMockDataStorage.items()[0].messageId,
      ),
    ).toEqual(
      initialItems.filter(
        item => item.messageId === ChatMessageAttachmentMockDataStorage.items()[0].messageId,
      ),
    );

    expect(ChatMessageAttachmentMockDataStorage.items()).toEqual(initialItems);

    ChatMessageAttachmentMockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentService.findAllForChatMessage).toHaveBeenCalled();
  });

  it('should not find chat message with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(() => controller.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageService.findById).toHaveBeenCalled();
  });

  it('should update a list of existing chat messages by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updateChatMessageDtoList) {
      const received = await controller.update({}, item.id, item.data);
      const expected = Object.assign(
        {},
        initialItems.find(x => x.id === item.id),
        item.data,
      );
      expect(received).toEqual(expected);
      updatedItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const updated = updatedItems.find(x => x.id === item.id);

        return updated ? updated : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageService.update).toHaveBeenCalled();
  });

  it('should not update a chat message with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() =>
      controller.update({}, '', { ...MockDataStorage.updateChatMessageDtoList[0].data }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing chat messages by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeChatMessageDtoList) {
      const received = await controller.remove(item.id);
      expect(received).toEqual({
        ...item,
        createdAt: received.createdAt,
        updatedAt: received.updatedAt,
        removedAt: received.removedAt,
      });
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeChatMessageDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageService.remove).toHaveBeenCalled();
  });

  it('should not remove a chat message with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageService.remove).toHaveBeenCalled();
  });
});
