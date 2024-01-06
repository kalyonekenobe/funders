import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';
import { UpdateChatDto } from 'src/chat/dto/update-chat.dto';
import { ChatEntity } from 'src/chat/entities/chat.entity';

// Mock data storage
export class MockDataStorage {
  static #data: ChatEntity[] = [];
  static #defaultData: ChatEntity[] = [
    { id: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f', name: 'Friends' },
    { id: 'b7af9cd4-5533-4737-862b-78bce985c987', name: 'Chat group' },
    { id: '989d32c2-abd4-43d3-a420-ee175ae16b98', name: null },
  ];

  static createChatDtoList: CreateChatDto[] = [{ name: 'Chat_1' }, { name: null }];

  static updateChatDtoList: {
    id: string;
    data: UpdateChatDto;
  }[] = [
    { id: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f', data: { name: null } },
    { id: 'b7af9cd4-5533-4737-862b-78bce985c987', data: { name: 'Chat group_changed' } },
    { id: '989d32c2-abd4-43d3-a420-ee175ae16b98', data: { name: 'Not null' } },
  ];

  static removeChatDtoList: ChatEntity[] = [
    { id: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f', name: 'Friends' },
    { id: '989d32c2-abd4-43d3-a420-ee175ae16b98', name: null },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: ChatEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockChatService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve(MockDataStorage.items())),
  findById: jest.fn().mockImplementation((id: string) => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Chat with this id does not exist!');
    }

    return Promise.resolve(dto);
  }),
  create: jest.fn().mockImplementation((dto: CreateChatDto): Promise<ChatEntity> => {
    const exists = MockDataStorage.items().find(item => item.id === dto.name);

    if (exists) {
      throw new Error('Chat with this id already exists!');
    }

    MockDataStorage.items().push({ id: '', ...dto });

    return Promise.resolve({ id: '', ...dto });
  }),
  update: jest.fn().mockImplementation((id: string, dto: UpdateChatDto): Promise<ChatEntity> => {
    let exists = MockDataStorage.items().find(item => item.id === id);

    if (!exists) {
      throw new Error('Chat with this id does not exist!');
    }

    exists = MockDataStorage.items().find(item => item.id === dto.name);

    if (exists) {
      throw new Error('Chat with provided new name already exists!');
    }

    MockDataStorage.setItems(
      MockDataStorage.items().map(item => (item.id === id ? { ...dto, id } : item)),
    );

    return Promise.resolve({ ...dto, id });
  }),
  remove: jest.fn().mockImplementation((id: string): Promise<ChatEntity> => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Chat with this id does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== id));

    return Promise.resolve({ ...dto, id });
  }),
};

export const mockChatRepository = {
  chat: {
    findMany: jest.fn().mockImplementation(() => MockDataStorage.items()),
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
    create: jest.fn().mockImplementation((dto: { data: CreateChatDto }): Promise<ChatEntity> => {
      const exists = MockDataStorage.items().find(item => item.id === dto.data.name);

      if (exists) {
        throw new PrismaClientValidationError('Chat with this id already exists!', {
          clientVersion: '',
        });
      }

      MockDataStorage.items().push({ id: '', ...dto.data });

      return Promise.resolve({ id: '', ...dto.data });
    }),
    update: jest
      .fn()
      .mockImplementation(
        (dto: { where: { id: string }; data: UpdateChatDto }): Promise<ChatEntity> => {
          let exists = MockDataStorage.items().find(item => item.id === dto.where.id);

          if (!exists) {
            throw new PrismaClientKnownRequestError('Chat with this id does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          exists = MockDataStorage.items().find(item => item.id === dto.data.name);

          if (exists) {
            throw new PrismaClientValidationError('Chat with provided new name already exists!', {
              clientVersion: '',
            });
          }

          MockDataStorage.setItems(
            MockDataStorage.items().map(item =>
              item.id === dto.where.id ? { id: dto.where.id, ...dto.data } : item,
            ),
          );

          return Promise.resolve({ id: dto.where.id, ...dto.data });
        },
      ),
    delete: jest.fn().mockImplementation((data: { where: { id: string } }): Promise<ChatEntity> => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Chat with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== data.where.id));

      return Promise.resolve({ id: data.where.id, name: dto.name });
    }),
  },
};
