import { Test, TestingModule } from '@nestjs/testing';
import {
  MockDataStorage,
  mockChatMessageAttachmentRepository,
} from './chat-message-attachment.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { ChatMessageAttachmentService } from 'src/chat-message-attachment/chat-message-attachment.service';

describe('ChatMessageAttachmentService', () => {
  let service: ChatMessageAttachmentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatMessageAttachmentService,
        {
          provide: CloudinaryService,
          useValue: {
            prepareSingleResourceForUpload: file => ({
              resource: { publicId: file.file, resourceType: file.resourceType },
              upload: () => {},
            }),
            prepareSingleResourceForDelete: () => ({
              resource: { publicId: '', resourceType: '' },
              delete: () => {},
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: mockChatMessageAttachmentRepository,
        },
      ],
    }).compile();

    service = module.get<ChatMessageAttachmentService>(ChatMessageAttachmentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find chat message attachments list by chat message id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findAllForChatMessage(item.messageId)).toEqual(
        MockDataStorage.items().filter(x => x.messageId === item.messageId),
      );
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentRepository.chatMessage.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatMessageAttachmentRepository.chatMessageAttachment.findMany).toHaveBeenCalled();
  });

  it('should set the list of chat message attachments for the chat message with specified id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(
      await service.setChatMessageAttachments(
        '4',
        MockDataStorage.createChatMessageAttachmentDtoList,
      ),
    ).toEqual([]);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentRepository.chatMessageAttachment.deleteMany).toHaveBeenCalled();
    expect(mockChatMessageAttachmentRepository.chatMessageAttachment.createMany).toHaveBeenCalled();
    expect(mockChatMessageAttachmentRepository.chatMessageAttachment.findMany).toHaveBeenCalled();
  });

  it('should find chat message attachments list by chat message attachment id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockChatMessageAttachmentRepository.chatMessageAttachment.findUniqueOrThrow,
    ).toHaveBeenCalled();
  });

  it('should not find chat message attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(service.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockChatMessageAttachmentRepository.chatMessageAttachment.findUniqueOrThrow,
    ).toHaveBeenCalled();
  });

  it('should update a list of existing chat message attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updateChatMessageAttachmentDtoList) {
      const received = await service.update(item.id, item.data, {
        file: item.data.file,
        resourceType: item.data.resourceType,
      } as any);
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
    expect(mockChatMessageAttachmentRepository.chatMessageAttachment.update).toHaveBeenCalled();
  });

  it('should not update a chat message attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.update(
        '',
        { ...MockDataStorage.updateChatMessageAttachmentDtoList[0].data },
        {} as any,
      ),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentRepository.chatMessageAttachment.update).toHaveBeenCalled();
  });

  it('should remove a list of existing chat message attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeChatMessageAttachmentDtoList) {
      const received = await service.remove(item.id);
      expect(received).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeChatMessageAttachmentDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentRepository.chatMessageAttachment.delete).toHaveBeenCalled();
  });

  it('should not remove a chat message attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageAttachmentRepository.chatMessageAttachment.delete).toHaveBeenCalled();
  });
});
