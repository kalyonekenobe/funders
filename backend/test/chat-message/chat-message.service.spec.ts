import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockChatMessageRepository } from './chat-message.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { ChatMessageService } from 'src/chat-message/chat-message.service';

describe('ChatMessageService', () => {
  let service: ChatMessageService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatMessageService,
        CloudinaryService,
        {
          provide: PrismaService,
          useValue: mockChatMessageRepository,
        },
      ],
    }).compile();

    service = module.get<ChatMessageService>(ChatMessageService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new chat messages', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createChatMessageDtoList) {
      const received = await service.create(item.chatId, item.data, {});
      const expected = { ...received, ...item.data, chatId: item.chatId };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageRepository.chatMessage.create).toHaveBeenCalled();
  });

  it('should not create a new chat message because chat with specified id was not found', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.create('', MockDataStorage.createChatMessageDtoList[0].data, {}),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageRepository.chatMessage.create).toHaveBeenCalled();
  });

  it('should find chat messages list by ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageRepository.chatMessage.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should not find chat message with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(service.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageRepository.chatMessage.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should find chat messages list for chat with specified id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllForChat(MockDataStorage.items()[0].chatId)).toEqual(
      initialItems.filter(item => item.chatId === MockDataStorage.items()[0].chatId),
    );

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageRepository.chat.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatMessageRepository.chatMessage.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should update a list of existing chat messages by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updateChatMessageDtoList) {
      const received = await service.update(item.id, item.data, {});
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
    expect(mockChatMessageRepository.chatMessage.update).toHaveBeenCalled();
  });

  it('should not update a chat message with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.update('', { ...MockDataStorage.updateChatMessageDtoList[0].data }, {}),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageRepository.chatMessage.update).toHaveBeenCalled();
  });

  it('should remove a list of existing chat messages by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeChatMessageDtoList) {
      const received = await service.remove(item.id);
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
    expect(mockChatMessageRepository.chatMessage.delete).toHaveBeenCalled();
  });

  it('should not remove a chat message with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatMessageRepository.chatMessage.delete).toHaveBeenCalled();
  });
});
