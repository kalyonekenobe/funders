import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateChatsOnUsersDto } from 'src/chats-on-users/dto/create-chats-on-users.dto';
import { UpdateChatsOnUsersDto } from 'src/chats-on-users/dto/update-chats-on-users.dto';
import { ChatsOnUsersEntity } from 'src/chats-on-users/entities/chats-on-users.entity';

// Mock data storage
export class MockDataStorage {
  static #data: ChatsOnUsersEntity[] = [];
  static #defaultData: ChatsOnUsersEntity[] = [
    {
      chatId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      userId: 'fad46cc6-cfc2-4e46-a9ce-c7ffdeeac0cb',
      role: 'Owner',
      chat: {
        id: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      } as any,
      user: {
        id: 'fad46cc6-cfc2-4e46-a9ce-c7ffdeeac0cb',
      } as any,
    },
    {
      chatId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      userId: '32ed0ca0-63f3-473c-8a6b-4e7cd735cc8c',
      role: 'Owner',
      chat: {
        id: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      } as any,
      user: {
        id: '32ed0ca0-63f3-473c-8a6b-4e7cd735cc8c',
      } as any,
    },
    {
      chatId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      userId: 'c21cea99-4d7f-4649-9b12-3ad5946717b2',
      role: 'Moderator',
      chat: {
        id: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      } as any,
      user: {
        id: 'c21cea99-4d7f-4649-9b12-3ad5946717b2',
      } as any,
    },
    {
      chatId: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      userId: 'c21cea99-4d7f-4649-9b12-3ad5946717b2',
      role: 'Participant',
      chat: {
        id: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      } as any,
      user: {
        id: 'c21cea99-4d7f-4649-9b12-3ad5946717b2',
      } as any,
    },
    {
      chatId: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      userId: 'fad46cc6-cfc2-4e46-a9ce-c7ffdeeac0cb',
      role: 'Moderator',
      chat: {
        id: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      } as any,
      user: {
        id: 'fad46cc6-cfc2-4e46-a9ce-c7ffdeeac0cb',
      } as any,
    },
    {
      chatId: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      userId: '32ed0ca0-63f3-473c-8a6b-4e7cd735cc8c',
      role: 'Participant',
      chat: {
        id: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      } as any,
      user: {
        id: '32ed0ca0-63f3-473c-8a6b-4e7cd735cc8c',
      } as any,
    },
    {
      chatId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      userId: '32ed0ca0-63f3-473c-8a6b-4e7cd735cc8c',
      role: 'Owner',
      chat: {
        id: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      } as any,
    },
  ];

  static createChatsOnUsersDtoList: { chatId: string; data: CreateChatsOnUsersDto }[] = [
    {
      chatId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      data: { userId: 'da70f5fb-67ca-49be-aacf-77edb0c095bd', role: 'Participant' },
    },
    {
      chatId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      data: { userId: 'da70f5fb-67ca-49be-aacf-77edb0c095bd', role: 'Owner' },
    },
    {
      chatId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      data: { userId: 'fad46cc6-cfc2-4e46-a9ce-c7ffdeeac0cb', role: 'Moderator' },
    },
  ];

  static updateChatsOnUsersDtoList: {
    chatId: string;
    userId: string;
    data: UpdateChatsOnUsersDto;
  }[] = [
    {
      chatId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      userId: 'fad46cc6-cfc2-4e46-a9ce-c7ffdeeac0cb',
      data: { role: 'Participant' },
    },
  ];

  static removeCategoriesOnPostsDtoList: ChatsOnUsersEntity[] = [
    {
      chatId: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      userId: 'fad46cc6-cfc2-4e46-a9ce-c7ffdeeac0cb',
      role: 'Moderator',
      chat: {
        id: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      } as any,
      user: {
        id: 'fad46cc6-cfc2-4e46-a9ce-c7ffdeeac0cb',
      } as any,
    },
    {
      chatId: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      userId: '32ed0ca0-63f3-473c-8a6b-4e7cd735cc8c',
      role: 'Participant',
      chat: {
        id: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      } as any,
      user: {
        id: '32ed0ca0-63f3-473c-8a6b-4e7cd735cc8c',
      } as any,
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: ChatsOnUsersEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockChatsOnUsersService = {
  findById: jest.fn().mockImplementation((chatId: string, userId: string) => {
    const result = MockDataStorage.items().find(
      item => item.userId === userId && item.chatId === chatId,
    );

    if (!result) {
      throw new Error('ChatsOnUsers with this userId and chatId does not exist!');
    }

    return Promise.resolve(result);
  }),
  findAllUsersForChat: jest
    .fn()
    .mockImplementation((chatId: string): Promise<ChatsOnUsersEntity[]> => {
      const data = MockDataStorage.items().find(item => item.chatId === chatId);

      if (!data) {
        throw new Error('Chat with this id does not exist!');
      }

      return Promise.resolve(MockDataStorage.items().filter(item => item.chatId === chatId));
    }),
  findAllChatsForUser: jest
    .fn()
    .mockImplementation((userId: string): Promise<ChatsOnUsersEntity[]> => {
      const data = MockDataStorage.items().find(item => item.userId === userId);

      if (!data) {
        throw new Error('User with this id does not exist!');
      }

      return Promise.resolve(MockDataStorage.items().filter(item => item.userId === userId));
    }),
  create: jest
    .fn()
    .mockImplementation(
      (chatId: string, dto: CreateChatsOnUsersDto): Promise<ChatsOnUsersEntity> => {
        const exists = MockDataStorage.items().find(
          item => item.chatId === chatId && item.userId === dto.userId,
        );

        if (exists) {
          throw new Error('ChatsOnUsers with this chatId and userId already exists!');
        }

        MockDataStorage.items().push({ ...dto, chatId });

        return Promise.resolve({ ...dto, chatId });
      },
    ),
  update: jest
    .fn()
    .mockImplementation(
      (chatId: string, userId: string, dto: UpdateChatsOnUsersDto): Promise<ChatsOnUsersEntity> => {
        const exists = MockDataStorage.items().find(
          item => item.chatId === chatId && item.userId === userId,
        );

        if (!exists) {
          throw new Error('ChatsOnUsers with this chatId or userId does not exist!');
        }

        MockDataStorage.setItems(
          MockDataStorage.items().map(item =>
            item.chatId === chatId && item.userId === userId ? { ...exists, ...dto } : item,
          ),
        );

        return Promise.resolve({ ...exists, ...dto });
      },
    ),
  remove: jest
    .fn()
    .mockImplementation((chatId: string, userId: string): Promise<ChatsOnUsersEntity> => {
      const exists = MockDataStorage.items().find(
        item => item.chatId === chatId && item.userId === userId,
      );

      if (!exists) {
        throw new Error('ChatsOnUsers with this chatId or userId does not exist!');
      }

      MockDataStorage.setItems(
        MockDataStorage.items().filter(item => !(item.chatId === chatId && item.userId === userId)),
      );

      return Promise.resolve(exists);
    }),
};

export const mockChatsOnUsersRepository = {
  chatsOnUsers: {
    findUniqueOrThrow: jest
      .fn()
      .mockImplementation(
        (data: { where: { chatId_userId: { chatId: string; userId: string } } }) => {
          const result = MockDataStorage.items().find(
            item =>
              item.userId === data.where.chatId_userId.userId &&
              item.chatId === data.where.chatId_userId.chatId,
          );

          if (!result) {
            throw new PrismaClientKnownRequestError(
              'ChatsOnUsers with this userId and chatId does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          return Promise.resolve(result);
        },
      ),
    findMany: jest
      .fn()
      .mockImplementation((data?: { where: { chatId?: string; userId?: string } }) => {
        if (!data) {
          return MockDataStorage.items();
        } else {
          return Promise.resolve(
            data.where.chatId
              ? MockDataStorage.items().filter(item => item.chatId === data.where.chatId)
              : MockDataStorage.items().filter(item => item.userId === data.where.userId),
          );
        }
      }),
    create: jest
      .fn()
      .mockImplementation(
        (dto: {
          data: CreateChatsOnUsersDto & { chatId: string };
        }): Promise<ChatsOnUsersEntity> => {
          const exists = MockDataStorage.items().find(
            item => item.chatId === dto.data.chatId && item.userId === dto.data.userId,
          );

          if (exists) {
            throw new PrismaClientValidationError(
              'ChatsOnUsers with this chatId and userId already exists!',
              {
                clientVersion: '',
              },
            );
          }

          MockDataStorage.items().push(dto.data);

          return Promise.resolve(dto.data);
        },
      ),
    update: jest
      .fn()
      .mockImplementation(
        (dto: {
          data: UpdateChatsOnUsersDto;
          where: { chatId_userId: { chatId: string; userId: string } };
        }): Promise<ChatsOnUsersEntity> => {
          const exists = MockDataStorage.items().find(
            item =>
              item.chatId === dto.where.chatId_userId.chatId &&
              item.userId === dto.where.chatId_userId.userId,
          );

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'ChatsOnUsers with this chatId or userId does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          MockDataStorage.setItems(
            MockDataStorage.items().map(item =>
              item.chatId === dto.where.chatId_userId.chatId &&
              item.userId === dto.where.chatId_userId.userId
                ? { ...exists, ...dto.data }
                : item,
            ),
          );

          return Promise.resolve({ ...exists, ...dto.data });
        },
      ),
    delete: jest
      .fn()
      .mockImplementation(
        (dto: {
          where: { chatId_userId: { chatId: string; userId: string } };
        }): Promise<ChatsOnUsersEntity> => {
          const exists = MockDataStorage.items().find(
            item =>
              item.chatId === dto.where.chatId_userId.chatId &&
              item.userId === dto.where.chatId_userId.userId,
          );

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'ChatsOnUsers with this chatId or userId does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          MockDataStorage.setItems(
            MockDataStorage.items().filter(
              item =>
                !(
                  item.chatId === dto.where.chatId_userId.chatId &&
                  item.userId === dto.where.chatId_userId.userId
                ),
            ),
          );

          return Promise.resolve(exists);
        },
      ),
  },
  chat: {
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const result = MockDataStorage.items().find(item => item.chatId === data.where.id);

      if (!result) {
        throw new PrismaClientKnownRequestError('Chat with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(result);
    }),
  },
  user: {
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const result = MockDataStorage.items().find(item => item.userId === data.where.id);

      if (!result) {
        throw new PrismaClientKnownRequestError('User with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(result);
    }),
  },
  $transaction: jest.fn().mockImplementation(callback => callback(mockChatsOnUsersRepository)),
};
