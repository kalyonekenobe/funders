import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateUsersBanListRecordDto } from 'src/users-ban-list-record/dto/create-users-ban-list-record.dto';
import { UpdateUsersBanListRecordDto } from 'src/users-ban-list-record/dto/update-users-ban-list-record.dto';
import { UsersBanListRecordEntity } from 'src/users-ban-list-record/entities/users-ban-list-record.entity';

// Mock data storage
export class MockDataStorage {
  static #data: UsersBanListRecordEntity[] = [];
  static #defaultData: UsersBanListRecordEntity[] = [
    {
      id: '7aeec5fa-f2dd-4e48-8a4c-6eaad3b25f23',
      userId: 'add65531-5d7d-4a97-98fc-e0b4dfbe094c',
      status: 'Permanent',
      bannedAt: new Date('2024-01-05T17:41:27.116Z'),
      dueTo: null,
      note: 'Publishing false publications for illegal fundraising',
      permissionsPenalty: BigInt(255),
    },
    {
      id: 'e7c5bfca-b978-4160-8d69-5995791017c5',
      userId: '114a0555-f561-4e5d-ba81-1a279c7727d0',
      status: 'Temporary',
      bannedAt: new Date('2024-01-05T17:41:27.116Z'),
      dueTo: new Date('2024-10-09T09:14:41.000Z'),
      note: 'The use of profanity',
      permissionsPenalty: BigInt(1241251),
    },
    {
      id: '972969d3-21eb-4e52-bf6d-3573835d127c',
      userId: '114a0555-f561-4e5d-ba81-1a279c7727d0',
      status: 'Temporary',
      bannedAt: new Date('2024-01-05T17:41:27.116Z'),
      dueTo: new Date('2024-10-09T09:14:41.000Z'),
      note: 'The use of profanity',
      permissionsPenalty: BigInt(1241251),
    },
    {
      id: '7ff86bb4-181a-4b94-a87d-a106ebaef98f',
      userId: '114a0555-f561-4e5d-ba81-1a279c7727d0',
      status: 'Temporary',
      bannedAt: new Date('2024-01-05T17:41:27.116Z'),
      dueTo: new Date('2024-10-09T09:14:41.000Z'),
      note: 'The use of profanity',
      permissionsPenalty: BigInt(1241251),
    },
  ];

  static createUsersBanListRecordDtoList: CreateUsersBanListRecordDto[] = [
    {
      userId: '114a0555-f561-4e5d-ba81-1a279c7727d0',
      status: 'Temporary',
      dueTo: new Date('2024-10-09T09:14:41.000Z'),
      note: 'The use of profanity',
      permissionsPenalty: BigInt(1241251),
    },
    {
      userId: 'add65531-5d7d-4a97-98fc-e0b4dfbe094c',
      status: 'Permanent',
      dueTo: null,
      note: 'Publishing false publications for illegal fundraising',
      permissionsPenalty: BigInt(255),
    },
  ];

  static updateUsersBanListRecordDtoList: {
    id: string;
    data: UpdateUsersBanListRecordDto;
  }[] = [
    { id: '7aeec5fa-f2dd-4e48-8a4c-6eaad3b25f23', data: { note: '' } },
    { id: 'e7c5bfca-b978-4160-8d69-5995791017c5', data: { dueTo: null, status: 'Permanent' } },
    { id: '972969d3-21eb-4e52-bf6d-3573835d127c', data: { permissionsPenalty: BigInt(555555) } },
  ];

  static removeUsersBanListRecordDtoList: UsersBanListRecordEntity[] = [
    {
      id: 'e7c5bfca-b978-4160-8d69-5995791017c5',
      userId: '114a0555-f561-4e5d-ba81-1a279c7727d0',
      status: 'Temporary',
      bannedAt: new Date('2024-01-05T17:41:27.116Z'),
      dueTo: new Date('2024-10-09T09:14:41.000Z'),
      note: 'The use of profanity',
      permissionsPenalty: BigInt(1241251),
    },
    {
      id: '972969d3-21eb-4e52-bf6d-3573835d127c',
      userId: '114a0555-f561-4e5d-ba81-1a279c7727d0',
      status: 'Temporary',
      bannedAt: new Date('2024-01-05T17:41:27.116Z'),
      dueTo: new Date('2024-10-09T09:14:41.000Z'),
      note: 'The use of profanity',
      permissionsPenalty: BigInt(1241251),
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: UsersBanListRecordEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockUsersBanListRecordService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve(MockDataStorage.items())),
  findById: jest.fn().mockImplementation((id: string) => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Users ban list record with this id does not exist!');
    }

    return Promise.resolve(dto);
  }),
  create: jest
    .fn()
    .mockImplementation((dto: CreateUsersBanListRecordDto): Promise<UsersBanListRecordEntity> => {
      const created = {
        ...dto,
        id: '',
        bannedAt: new Date(),
      };

      MockDataStorage.items().push(created);

      return Promise.resolve(created);
    }),
  update: jest
    .fn()
    .mockImplementation(
      (id: string, dto: UpdateUsersBanListRecordDto): Promise<UsersBanListRecordEntity> => {
        let exists = MockDataStorage.items().find(item => item.id === id);

        if (!exists) {
          throw new Error('Users ban list record with this id does not exist!');
        }

        const updated = { ...exists, ...dto };

        MockDataStorage.setItems(
          MockDataStorage.items().map(item => (item.id === id ? updated : item)),
        );

        return Promise.resolve(updated);
      },
    ),
  remove: jest.fn().mockImplementation((id: string): Promise<UsersBanListRecordEntity> => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Users ban list record with this id does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== id));

    return Promise.resolve(dto);
  }),
};

export const mockUsersBanListRecordRepository = {
  usersBanListRecord: {
    findMany: jest.fn().mockImplementation(() => MockDataStorage.items()),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError(
          'Users ban list record with this id does not exist!',
          {
            code: 'P2001',
            clientVersion: '',
          },
        );
      }

      return Promise.resolve(dto);
    }),
    create: jest
      .fn()
      .mockImplementation(
        (dto: { data: CreateUsersBanListRecordDto }): Promise<UsersBanListRecordEntity> => {
          const created = {
            ...dto.data,
            id: '',
            bannedAt: new Date(),
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
          data: UpdateUsersBanListRecordDto;
        }): Promise<UsersBanListRecordEntity> => {
          let exists = MockDataStorage.items().find(item => item.id === dto.where.id);

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'Users ban list record with this id does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          const updated = { ...exists, ...dto.data };

          MockDataStorage.setItems(
            MockDataStorage.items().map(item => (item.id === dto.where.id ? updated : item)),
          );

          return Promise.resolve(updated);
        },
      ),
    delete: jest
      .fn()
      .mockImplementation((data: { where: { id: string } }): Promise<UsersBanListRecordEntity> => {
        const dto = MockDataStorage.items().find(item => item.id === data.where.id);

        if (!dto) {
          throw new PrismaClientKnownRequestError('Users ban list record this id does not exist!', {
            code: 'P2001',
            clientVersion: '',
          });
        }

        MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== data.where.id));

        return Promise.resolve(dto);
      }),
  },
};
