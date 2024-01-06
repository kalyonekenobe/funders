import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateChatRoleDto } from 'src/chat-role/dto/create-chat-role.dto';
import { UpdateChatRoleDto } from 'src/chat-role/dto/update-chat-role.dto';
import { ChatRoleEntity } from 'src/chat-role/entities/chat-role.entity';

// Mock data storage
export class MockDataStorage {
  static #data: ChatRoleEntity[] = [];
  static #defaultData: ChatRoleEntity[] = [
    { name: 'Owner' },
    { name: 'Moderator' },
    { name: 'Default' },
  ];

  static createChatRoleDtoList: CreateChatRoleDto[] = [
    { name: 'Chat_Role_1' },
    { name: 'Chat_Role_2' },
  ];

  static updateChatRoleDtoList: {
    name: string;
    data: UpdateChatRoleDto;
  }[] = [
    { name: 'Owner', data: { name: 'Owner_updated' } },
    { name: 'Moderator', data: { name: 'Moderator_updated' } },
    { name: 'Default', data: { name: 'Default_updated' } },
  ];

  static removeChatRoleDtoList: ChatRoleEntity[] = [
    { name: 'Owner' },
    { name: 'Moderator' },
    { name: 'Default' },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: ChatRoleEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockChatRoleService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve(MockDataStorage.items())),
  create: jest.fn().mockImplementation((dto: CreateChatRoleDto): Promise<ChatRoleEntity> => {
    const exists = MockDataStorage.items().find(item => item.name === dto.name);

    if (exists) {
      throw new Error('Chat role with this name already exists!');
    }

    MockDataStorage.items().push(dto);

    return Promise.resolve(dto);
  }),
  update: jest
    .fn()
    .mockImplementation((name: string, dto: UpdateChatRoleDto): Promise<ChatRoleEntity> => {
      let exists = MockDataStorage.items().find(item => item.name === name);

      if (!exists) {
        throw new Error('Chat role with this name does not exist!');
      }

      exists = MockDataStorage.items().find(item => item.name === dto.name);

      if (exists) {
        throw new Error('Chat role with provided new name already exists!');
      }

      MockDataStorage.setItems(
        MockDataStorage.items().map(item => (item.name === name ? dto : item)),
      );

      return Promise.resolve(dto);
    }),
  remove: jest.fn().mockImplementation((name: string): Promise<ChatRoleEntity> => {
    const dto = MockDataStorage.items().find(item => item.name === name);

    if (!dto) {
      throw new Error('Chat role with this name does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.name !== name));

    return Promise.resolve({ name: dto.name });
  }),
};

export const mockChatRoleRepository = {
  chatRole: {
    findMany: jest.fn().mockImplementation(() => MockDataStorage.items()),
    create: jest
      .fn()
      .mockImplementation((dto: { data: CreateChatRoleDto }): Promise<ChatRoleEntity> => {
        const exists = MockDataStorage.items().find(item => item.name === dto.data.name);

        if (exists) {
          throw new PrismaClientValidationError('Chat role with this name already exists!', {
            clientVersion: '',
          });
        }

        MockDataStorage.items().push(dto.data);

        return Promise.resolve(dto.data);
      }),
    update: jest
      .fn()
      .mockImplementation(
        (dto: { where: { name: string }; data: UpdateChatRoleDto }): Promise<ChatRoleEntity> => {
          let exists = MockDataStorage.items().find(item => item.name === dto.where.name);

          if (!exists) {
            throw new PrismaClientKnownRequestError('Chat role with this name does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          exists = MockDataStorage.items().find(item => item.name === dto.data.name);

          if (exists) {
            throw new PrismaClientValidationError(
              'Chat role with provided new name already exists!',
              { clientVersion: '' },
            );
          }

          MockDataStorage.setItems(
            MockDataStorage.items().map(item => (item.name === dto.where.name ? dto.data : item)),
          );

          return Promise.resolve(dto.data);
        },
      ),
    delete: jest
      .fn()
      .mockImplementation((data: { where: { name: string } }): Promise<ChatRoleEntity> => {
        const dto = MockDataStorage.items().find(item => item.name === data.where.name);

        if (!dto) {
          throw new PrismaClientKnownRequestError('Chat role with this name does not exist!', {
            code: 'P2001',
            clientVersion: '',
          });
        }

        MockDataStorage.setItems(
          MockDataStorage.items().filter(item => item.name !== data.where.name),
        );

        return Promise.resolve({ name: dto.name });
      }),
  },
};
