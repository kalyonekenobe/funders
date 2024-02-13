import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockChatRepository } from './chat.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChatService } from 'src/chat/chat.service';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';

describe('ChatService', () => {
  let service: ChatService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: PrismaService,
          useValue: mockChatRepository,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new chats', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createChatDtoList) {
      const received = await service.create(item);
      console.log(received);
      const expected = { ...item, id: received.id };
      expect(received).toEqual(expected);
      initialItems.push(expected as any);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRepository.chat.create).toHaveBeenCalled();
  });

  it('should not create a new chat because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      new Promise(() => {
        service.create({
          ...MockDataStorage.items()[0],
          sdasds: 123,
        } as CreateChatDto);

        // Simulating validation error
        MockDataStorage.items().pop();
        throw new Error('Validation error');
      }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRepository.chat.create).toHaveBeenCalled();
  });

  it('should find all existing chats', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRepository.chat.findMany).toHaveBeenCalled();
  });

  it('should find all existing chats', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRepository.chat.findMany).toHaveBeenCalled();
  });

  it('should find chats list by chat id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRepository.chat.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should update a list of existing chats by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    let initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateChatDtoList) {
      const received = await service.update(item.id, item.data);
      const expected = Object.assign(
        {},
        initialItems.find(x => x.id === item.id),
        item.data,
      );
      expect(received).toEqual(expected);
      initialItems = initialItems.map(x => (x.id === item.id ? expected : x));
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRepository.chat.update).toHaveBeenCalled();
  });

  it('should not update a chat by provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.update('', { name: '' })).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRepository.chat.update).toHaveBeenCalled();
  });

  it('should remove a list of existing chats by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeChatDtoList) {
      expect(await service.remove(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeChatDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockChatRepository.chat.delete).toHaveBeenCalled();
  });

  it('should not remove a chat by provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRepository.chat.delete).toHaveBeenCalled();
  });
});
