import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockChatMessageAttachmentService } from './chat-message-attachment.mock';
import { ChatMessageAttachmentService } from 'src/chat-message-attachment/chat-message-attachment.service';
import { ChatMessageAttachmentController } from 'src/chat-message-attachment/chat-message-attachment.controller';

describe('ChatMessageAttachmentService', () => {
  let controller: ChatMessageAttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatMessageAttachmentController],
      providers: [
        {
          provide: ChatMessageAttachmentService,
          useValue: mockChatMessageAttachmentService,
        },
      ],
    }).compile();

    controller = module.get<ChatMessageAttachmentController>(ChatMessageAttachmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find chat message attachments list by chat message attachment id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentService.findById).toHaveBeenCalled();
  });

  it('should not find chat message attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(() => controller.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentService.findById).toHaveBeenCalled();
  });

  it('should update a list of existing chat message attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updateChatMessageAttachmentDtoList) {
      const received = await controller.update(
        {
          file: item.data.file,
          resourceType: item.data.resourceType,
        } as any,
        item.id,
        item.data,
      );
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
    expect(mockChatMessageAttachmentService.update).toHaveBeenCalled();
  });

  it('should not update a chat message attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() =>
      controller.update({} as any, '', {
        ...MockDataStorage.updateChatMessageAttachmentDtoList[0].data,
      }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing chat message attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeChatMessageAttachmentDtoList) {
      const received = await controller.remove(item.id);
      expect(received).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeChatMessageAttachmentDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentService.remove).toHaveBeenCalled();
  });

  it('should not remove a chat message attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentService.remove).toHaveBeenCalled();
  });
});
