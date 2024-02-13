import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateChatMessageDto } from 'src/chat-message/dto/create-chat-message.dto';
import { UpdateChatMessageDto } from 'src/chat-message/dto/update-chat-message.dto';
import { ChatMessageEntity } from 'src/chat-message/entities/chat-message.entity';

// Mock data storage
export class MockDataStorage {
  static #data: ChatMessageEntity[] = [];
  static #defaultData: ChatMessageEntity[] = [
    {
      id: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      chatId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      authorId: '86362221-935b-4b15-a8cb-00be736f1795',
      replyTo: null,
      isPinned: true,
      text: `Chat message 1`,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
    {
      id: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      chatId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      authorId: '86362221-935b-4b15-a8cb-00be736f1795',
      text: `Chat message 2`,
      replyTo: null,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
    {
      id: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      chatId: '86362221-935b-4b15-a8cb-00be736f1795',
      authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
      text: `Chat message 3`,
      replyTo: null,
      isPinned: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
    {
      id: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      chatId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      authorId: '34594f15-8346-4576-a6e1-8c0af156ed86',
      text: `Chat message 4`,
      replyTo: null,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
    {
      id: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      chatId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
      text: `Chat message 5`,
      replyTo: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
  ];

  static createChatMessageDtoList: { chatId: string; data: CreateChatMessageDto }[] = [
    {
      chatId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      data: {
        authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
        replyTo: null,
        text: `1`,
        attachments: [],
      },
    },
    {
      chatId: '86362221-935b-4b15-a8cb-00be736f1795',
      data: {
        authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
        replyTo: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
        text: `1`,
        attachments: [],
      },
    },
  ];

  static updateChatMessageDtoList: {
    id: string;
    data: UpdateChatMessageDto;
  }[] = [
    { id: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc', data: { text: 'New text' } },
    { id: '940860d0-ea49-40cc-bfb1-82633e0b1b10', data: { text: 'Edited' } },
    { id: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4', data: { text: 'Aboba' } },
  ];

  static removeChatMessageDtoList: ChatMessageEntity[] = [
    {
      id: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      chatId: '86362221-935b-4b15-a8cb-00be736f1795',
      authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
      text: `Chat message 3`,
      replyTo: null,
      isPinned: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
    {
      id: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      chatId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      authorId: '34594f15-8346-4576-a6e1-8c0af156ed86',
      text: `Chat message 4`,
      replyTo: null,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: ChatMessageEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockChatMessageService = {
  findAllForChat: jest
    .fn()
    .mockImplementation((chatId: string) =>
      Promise.resolve(MockDataStorage.items().filter(item => item.chatId === chatId)),
    ),
  findAllForUser: jest
    .fn()
    .mockImplementation((authorId: string) =>
      Promise.resolve(MockDataStorage.items().filter(item => item.authorId === authorId)),
    ),
  findById: jest.fn().mockImplementation((id: string) => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Chat message comment with this id does not exist!');
    }

    return Promise.resolve(dto);
  }),
  create: jest
    .fn()
    .mockImplementation(
      (chatId: string, dto: CreateChatMessageDto, files: unknown): Promise<ChatMessageEntity> => {
        const chat = MockDataStorage.items().find(item => item.chatId === chatId);

        if (!chat) {
          throw new Error('Chat with specified id was not found!');
        }

        const created = {
          ...dto,
          chatId,
          id: '',
          isPinned: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          removedAt: null,
        };

        MockDataStorage.items().push(created as any);

        return Promise.resolve(created as any);
      },
    ),
  update: jest
    .fn()
    .mockImplementation(
      (id: string, dto: UpdateChatMessageDto, files: unknown): Promise<ChatMessageEntity> => {
        let exists = MockDataStorage.items().find(item => item.id === id);

        if (!exists) {
          throw new Error('Chat message with this id does not exist!');
        }

        const updated = {
          ...exists,
          ...dto,
        };

        MockDataStorage.setItems(
          MockDataStorage.items().map(item => (item.id === id ? (updated as any) : item)),
        );

        return Promise.resolve(updated as any);
      },
    ),
  remove: jest.fn().mockImplementation((id: string): Promise<ChatMessageEntity> => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Chat message with this id does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== id));

    return Promise.resolve(dto);
  }),
};

export const mockChatMessageRepository = {
  chat: {
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.chatId === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Chat with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
  },
  chatMessage: {
    findMany: jest
      .fn()
      .mockImplementation((data?: { where: { authorId?: string; chatId?: string } }) => {
        if (!data) {
          return MockDataStorage.items();
        } else {
          return data.where.authorId
            ? MockDataStorage.items().filter(item => item.authorId === data.where.authorId)
            : MockDataStorage.items().filter(item => item.chatId === data.where.chatId);
        }
      }),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Chat with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
    create: jest
      .fn()
      .mockImplementation(
        (dto: { data: CreateChatMessageDto & { chatId: string } }): Promise<ChatMessageEntity> => {
          const Chat = MockDataStorage.items().find(item => item.chatId === dto.data.chatId);

          if (!Chat) {
            throw new PrismaClientKnownRequestError('Chat with this id does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          const created = {
            ...dto.data,
            chatId: dto.data.chatId,
            id: '',
            isPinned: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            removedAt: null,
            attachments: [],
          };

          MockDataStorage.items().push(created);

          return Promise.resolve(created);
        },
      ),
    update: jest
      .fn()
      .mockImplementation(
        (dto: {
          where: { id: string };
          data: UpdateChatMessageDto;
        }): Promise<ChatMessageEntity> => {
          let exists = MockDataStorage.items().find(item => item.id === dto.where.id);

          if (!exists) {
            throw new PrismaClientKnownRequestError('Chat message with this id does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          const updated = {
            ...exists,
            ...{ ...dto.data, attachments: [] },
          };

          MockDataStorage.setItems(
            MockDataStorage.items().map(item => (item.id === dto.where.id ? updated : item)),
          );

          return Promise.resolve(updated);
        },
      ),
    delete: jest
      .fn()
      .mockImplementation((data: { where: { id: string } }): Promise<ChatMessageEntity> => {
        const dto = MockDataStorage.items().find(item => item.id === data.where.id);

        if (!dto) {
          throw new PrismaClientKnownRequestError('Chat message this id does not exist!', {
            code: 'P2001',
            clientVersion: '',
          });
        }

        MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== data.where.id));

        return Promise.resolve(dto);
      }),
  },
  chatMessageAttachment: {
    findMany: jest.fn().mockImplementation(() => []),
  },
  $transaction: jest.fn().mockImplementation(callback => callback(mockChatMessageRepository)),
};
