import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockChatsOnUsersRepository } from './chats-on-users.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChatsOnUsersService } from 'src/chats-on-users/chats-on-users.service';

describe('ChatsOnUsersService', () => {
  let service: ChatsOnUsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsOnUsersService,
        {
          provide: PrismaService,
          useValue: mockChatsOnUsersRepository,
        },
      ],
    }).compile();

    service = module.get<ChatsOnUsersService>(ChatsOnUsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a user for specified chat', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createChatsOnUsersDtoList) {
      expect(await service.create(item.chatId, item.data)).toEqual({
        ...item.data,
        chatId: item.chatId,
      });

      initialItems.push({ ...item.data, chatId: item.chatId });
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersRepository.chat.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.chatsOnUsers.create).toHaveBeenCalled();
  });

  it('should not create a user for specified chat because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.create(MockDataStorage.items()[0].chatId, {
        userId: MockDataStorage.items()[0].userId,
        role: MockDataStorage.items()[0].role,
      }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersRepository.chat.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.chatsOnUsers.create).toHaveBeenCalled();
  });

  it('should find all users of specified chat', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllUsersForChat(MockDataStorage.items()[0].chatId)).toEqual(
      MockDataStorage.items()
        .filter(item => item.chatId === MockDataStorage.items()[0].chatId)
        .map(item => item.user),
    );

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersRepository.chat.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.chatsOnUsers.findMany).toHaveBeenCalled();
  });

  it('should find all chats of specified user', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllChatsForUser(MockDataStorage.items()[0].userId)).toEqual(
      MockDataStorage.items()
        .filter(item => item.userId === MockDataStorage.items()[0].userId)
        .map(item => item.chat),
    );

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersRepository.user.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.chatsOnUsers.findMany).toHaveBeenCalled();
  });

  it('should find all chats on users entities by ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(
      await service.findById(MockDataStorage.items()[0].chatId, MockDataStorage.items()[0].userId),
    ).toEqual(MockDataStorage.items()[0]);

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersRepository.chatsOnUsers.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should find a chats on users entity by id because chats on users entity with these chatId and userId does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.findById('', '')).rejects.toThrow();

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersRepository.chatsOnUsers.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should update a user for specified chat', async () => {
    MockDataStorage.setDefaultItems();

    let initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateChatsOnUsersDtoList) {
      expect(await service.update(item.chatId, item.userId, item.data)).toEqual({
        chatId: item.chatId,
        userId: item.userId,
        ...MockDataStorage.items().find(x => x.chatId === item.chatId && x.userId === item.userId),
      });

      initialItems = initialItems.map(x =>
        x.chatId === item.chatId && x.userId === item.userId
          ? {
              chatId: item.chatId,
              userId: item.userId,
              ...(MockDataStorage.items().find(
                x => x.chatId === item.chatId && x.userId === item.userId,
              ) as any),
            }
          : x,
      );
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersRepository.chat.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.user.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.chatsOnUsers.update).toHaveBeenCalled();
  });

  it('should not update user for specified chat because some userId does not exist for this chat', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.update('', '', {})).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersRepository.chat.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.user.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.chatsOnUsers.update).toHaveBeenCalled();
  });

  it('should remove a list of existing users for specified chats', async () => {
    MockDataStorage.setDefaultItems();

    let initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeCategoriesOnPostsDtoList) {
      const data = MockDataStorage.items().find(
        x => x.chatId === item.chatId && x.userId === item.userId,
      );
      expect(await service.remove(item.chatId, item.userId)).toEqual(data);

      initialItems = initialItems.filter(
        x => !(x.chatId === item.chatId && x.userId === item.userId),
      );
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersRepository.chat.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.user.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.chatsOnUsers.delete).toHaveBeenCalled();
  });

  it('should not remove user for specified chat because some userId does not exist for this chat', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('', '')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersRepository.chat.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.user.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockChatsOnUsersRepository.chatsOnUsers.delete).toHaveBeenCalled();
  });
});
