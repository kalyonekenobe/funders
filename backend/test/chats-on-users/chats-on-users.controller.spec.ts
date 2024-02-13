import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockChatsOnUsersService } from './chats-on-users.mock';
import { ChatsOnUsersController } from 'src/chats-on-users/chats-on-users.controller';
import { ChatsOnUsersService } from 'src/chats-on-users/chats-on-users.service';

describe('ChatsOnUsersController', () => {
  let controller: ChatsOnUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsOnUsersController],
      providers: [
        {
          provide: ChatsOnUsersService,
          useValue: mockChatsOnUsersService,
        },
      ],
    }).compile();

    controller = module.get<ChatsOnUsersController>(ChatsOnUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a user for specified chat', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createChatsOnUsersDtoList) {
      expect(await controller.create(item.chatId, item.data)).toEqual({
        ...item.data,
        chatId: item.chatId,
      });

      initialItems.push({ ...item.data, chatId: item.chatId });
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersService.create).toHaveBeenCalled();
  });

  it('should not create a user for specified chat because it already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() =>
      controller.create(MockDataStorage.items()[0].chatId, {
        userId: MockDataStorage.items()[0].userId,
        role: MockDataStorage.items()[0].role,
      }),
    ).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersService.create).toHaveBeenCalled();
  });

  it('should find all users of specified chat', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAllUsersForChat(MockDataStorage.items()[0].chatId)).toEqual(
      MockDataStorage.items().filter(item => item.chatId === MockDataStorage.items()[0].chatId),
    );

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersService.findAllUsersForChat).toHaveBeenCalled();
  });

  it('should find all chats on users entities by ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(
      await controller.findById(
        MockDataStorage.items()[0].chatId,
        MockDataStorage.items()[0].userId,
      ),
    ).toEqual(MockDataStorage.items()[0]);

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersService.findById).toHaveBeenCalled();
  });

  it('should find a chats on users entity by id because chats on users entity with these chatId and userId does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.findById('', '')).toThrow();

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersService.findById).toHaveBeenCalled();
  });

  it('should update a user for specified chat', async () => {
    MockDataStorage.setDefaultItems();

    let initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateChatsOnUsersDtoList) {
      expect(await controller.update(item.chatId, item.userId, item.data)).toEqual({
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
    expect(mockChatsOnUsersService.update).toHaveBeenCalled();
  });

  it('should not update user for specified chat because some userId does not exist for this chat', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.update('', '', {})).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing users for specified chats', async () => {
    MockDataStorage.setDefaultItems();

    let initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeCategoriesOnPostsDtoList) {
      const data = MockDataStorage.items().find(
        x => x.chatId === item.chatId && x.userId === item.userId,
      );
      expect(await controller.remove(item.chatId, item.userId)).toEqual(data);

      initialItems = initialItems.filter(
        x => !(x.chatId === item.chatId && x.userId === item.userId),
      );
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersService.remove).toHaveBeenCalled();
  });

  it('should not remove user for specified chat because some userId does not exist for this chat', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.remove('', '')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatsOnUsersService.remove).toHaveBeenCalled();
  });
});
