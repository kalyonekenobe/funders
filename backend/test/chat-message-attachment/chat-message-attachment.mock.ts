import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateChatMessageAttachmentDto } from 'src/chat-message-attachment/dto/create-chat-message-attachment.dto';
import { UpdateChatMessageAttachmentDto } from 'src/chat-message-attachment/dto/update-chat-message-attachment.dto';
import { ChatMessageAttachmentEntity } from 'src/chat-message-attachment/entities/chat-message-attachment.entity';

// Mock data storage
export class MockDataStorage {
  static #data: ChatMessageAttachmentEntity[] = [];
  static #defaultData: ChatMessageAttachmentEntity[] = [
    {
      id: '1',
      file: 'chat_message_attachments/1.jpg',
      filename: null,
      resourceType: 'image',
      messageId: '1',
    },
    {
      id: '2',
      file: 'chat_message_attachments/2.txt',
      filename: 'Document',
      resourceType: 'raw',
      messageId: '1',
    },
    {
      id: '3',
      file: 'chat_message_attachments/3.mp4',
      filename: null,
      resourceType: 'video',
      messageId: '2',
    },
  ];

  static createChatMessageAttachmentDtoList: CreateChatMessageAttachmentDto[] = [
    {
      file: 'chat_message_attachments/4.png',
      filename: null,
      resourceType: 'image',
      messageId: '1',
    },
    { file: 'chat_message_attachments/5.txt', filename: null, resourceType: 'raw', messageId: '1' },
  ];

  static updateChatMessageAttachmentDtoList: {
    id: string;
    data: UpdateChatMessageAttachmentDto;
  }[] = [
    {
      id: '1',
      data: { file: 'chat_message_attachments/4.png', filename: null, resourceType: 'image' },
    },
    {
      id: '3',
      data: { file: 'chat_message_attachments/5.txt', filename: null, resourceType: 'raw' },
    },
  ];

  static removeChatMessageAttachmentDtoList: ChatMessageAttachmentEntity[] = [
    {
      id: '1',
      file: 'chat_message_attachments/1.jpg',
      filename: null,
      resourceType: 'image',
      messageId: '1',
    },
    {
      id: '3',
      file: 'chat_message_attachments/3.mp4',
      filename: null,
      resourceType: 'video',
      messageId: '2',
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: ChatMessageAttachmentEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockChatMessageAttachmentService = {
  findAllForChatMessage: jest.fn().mockImplementation((messageId: string) => {
    const message = MockDataStorage.items().find(item => item.messageId === messageId);

    if (!message) {
      throw new Error('Chat message with specified id does not exist!');
    }

    return MockDataStorage.items().filter(item => item.messageId === messageId);
  }),
  findById: jest.fn().mockImplementation((id: string) => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Chat message attachment with this id does not exist!');
    }

    return Promise.resolve(dto);
  }),
  update: jest
    .fn()
    .mockImplementation(
      (
        id: string,
        dto: UpdateChatMessageAttachmentDto,
        file: Express.Multer.File,
      ): Promise<ChatMessageAttachmentEntity> => {
        let exists = MockDataStorage.items().find(item => item.id === id);

        if (!exists) {
          throw new Error('Chat message attachment with this id does not exist!');
        }

        const updated = {
          ...exists,
          ...dto,
        };

        MockDataStorage.setItems(
          MockDataStorage.items().map(item => (item.id === id ? updated : item)),
        );

        return Promise.resolve(updated);
      },
    ),
  remove: jest.fn().mockImplementation((id: string): Promise<ChatMessageAttachmentEntity> => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Chat message attachment with this id does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== id));

    return Promise.resolve(dto);
  }),
};

export const mockChatMessageAttachmentRepository = {
  chatMessageAttachment: {
    findMany: jest
      .fn()
      .mockImplementation((data?: { where: { messageId: string } }) =>
        !data
          ? MockDataStorage.items()
          : MockDataStorage.items().filter(item => item.messageId === data.where.messageId),
      ),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError(
          'Chat message attachment with this id does not exist!',
          {
            code: 'P2001',
            clientVersion: '',
          },
        );
      }

      return Promise.resolve(dto);
    }),
    createMany: jest.fn().mockImplementation((data: { data: CreateChatMessageAttachmentDto[] }) => {
      const created = data.data.map(item => ({ ...item, id: '' }));
      MockDataStorage.items().push(...created);
    }),
    update: jest
      .fn()
      .mockImplementation(
        (dto: {
          where: { id: string };
          data: UpdateChatMessageAttachmentDto;
        }): Promise<ChatMessageAttachmentEntity> => {
          let exists = MockDataStorage.items().find(item => item.id === dto.where.id);

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'Chat message attachment with this id does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          const updated = {
            ...exists,
            ...dto.data,
          };

          MockDataStorage.setItems(
            MockDataStorage.items().map(item => (item.id === dto.where.id ? updated : item)),
          );

          return Promise.resolve(updated);
        },
      ),
    delete: jest
      .fn()
      .mockImplementation(
        (data: { where: { id: string } }): Promise<ChatMessageAttachmentEntity> => {
          const dto = MockDataStorage.items().find(item => item.id === data.where.id);

          if (!dto) {
            throw new PrismaClientKnownRequestError(
              'Chat message attachment with this id does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          MockDataStorage.setItems(
            MockDataStorage.items().filter(item => item.id !== data.where.id),
          );

          return Promise.resolve(dto);
        },
      ),
    deleteMany: jest.fn().mockImplementation((data: { where: { messageId: string } }) => {
      MockDataStorage.setItems(
        MockDataStorage.items().filter(item => item.messageId !== data.where.messageId),
      );
    }),
  },
  chatMessage: {
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Chat message with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
  },
  $transaction: jest
    .fn()
    .mockImplementation(callback => callback(mockChatMessageAttachmentRepository)),
};
