import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateUsersBanListRecordStatusDto } from 'src/users-ban-list-record-status/dto/create-users-ban-list-record-status.dto';
import { UpdateUsersBanListRecordStatusDto } from 'src/users-ban-list-record-status/dto/update-users-ban-list-record-status.dto';
import { UsersBanListRecordStatusEntity } from 'src/users-ban-list-record-status/entities/users-ban-list-record-status.entity';

// Mock data storage
export class MockDataStorage {
  static #data: UsersBanListRecordStatusEntity[] = [];
  static #defaultData: UsersBanListRecordStatusEntity[] = [
    {
      name: 'Permanent',
      usersBanListRecords: [
        {
          id: '989d32c2-abd4-43d3-a420-ee175ae16b98',
          userId: '34f79b86-2151-4483-838f-0a0ed586a621',
          status: 'Permanent',
          note: 'Publishing false publications for illegal fundraising',
          dueTo: null,
          bannedAt: new Date(),
          permissionsPenalty: BigInt(255),
        },
      ],
    },
    {
      name: 'Temporary',
      usersBanListRecords: [
        {
          id: '26e6fdab-bbf8-4500-b78b-56378421b230',
          userId: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f',
          status: 'Temporary',
          dueTo: new Date('2024-10-09T12:14:41'),
          bannedAt: new Date(),
          note: 'The use of profanity',
          permissionsPenalty: BigInt(3),
        },
      ],
    },
  ];

  static createUsersBanListRecordStatusDtoList: CreateUsersBanListRecordStatusDto[] = [
    { name: 'New_Status' },
    { name: 'New_Status_2' },
    { name: 'New_Status_3' },
  ];

  static updateUsersBanListRecordStatusDtoList: {
    name: string;
    data: UpdateUsersBanListRecordStatusDto;
  }[] = [
    { name: 'Permanent', data: { name: 'Permanent_updated' } },
    { name: 'Temporary', data: { name: 'Temporary_updated' } },
  ];

  static removeUsersBanListRecordStatusDtoList: UsersBanListRecordStatusEntity[] = [
    { name: 'Permanent' },
    { name: 'Temporary' },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: UsersBanListRecordStatusEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockUsersBanListRecordStatusService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve(MockDataStorage.items())),
  create: jest
    .fn()
    .mockImplementation(
      (dto: CreateUsersBanListRecordStatusDto): Promise<UsersBanListRecordStatusEntity> => {
        const exists = MockDataStorage.items().find(item => item.name === dto.name);

        if (exists) {
          throw new Error('Users ban list record status with this name already exists!');
        }

        MockDataStorage.items().push(dto);

        return Promise.resolve(dto);
      },
    ),
  update: jest
    .fn()
    .mockImplementation(
      (
        name: string,
        dto: UpdateUsersBanListRecordStatusDto,
      ): Promise<UsersBanListRecordStatusEntity> => {
        let exists = MockDataStorage.items().find(item => item.name === name);

        if (!exists) {
          throw new Error('Users ban list record status with this name does not exist!');
        }

        exists = MockDataStorage.items().find(item => item.name === dto.name);

        if (exists) {
          throw new Error('Users ban list record status with provided new name already exists!');
        }

        MockDataStorage.setItems(
          MockDataStorage.items().map(item => (item.name === name ? dto : item)),
        );

        return Promise.resolve(dto);
      },
    ),
  remove: jest.fn().mockImplementation((name: string): Promise<UsersBanListRecordStatusEntity> => {
    const dto = MockDataStorage.items().find(item => item.name === name);

    if (!dto) {
      throw new Error('Users ban list record status with this name does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.name !== name));

    return Promise.resolve({ name: dto.name });
  }),
};

export const mockUsersBanListRecordStatusRepository = {
  usersBanListRecordStatus: {
    findMany: jest.fn().mockImplementation(() => MockDataStorage.items()),
    create: jest
      .fn()
      .mockImplementation(
        (dto: {
          data: CreateUsersBanListRecordStatusDto;
        }): Promise<UsersBanListRecordStatusEntity> => {
          const exists = MockDataStorage.items().find(item => item.name === dto.data.name);

          if (exists) {
            throw new PrismaClientValidationError(
              'Users ban list record status with this name already exists!',
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
          where: { name: string };
          data: UpdateUsersBanListRecordStatusDto;
        }): Promise<UsersBanListRecordStatusEntity> => {
          let exists = MockDataStorage.items().find(item => item.name === dto.where.name);

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'Users ban list records status with this name does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          exists = MockDataStorage.items().find(item => item.name === dto.data.name);

          if (exists) {
            throw new PrismaClientValidationError(
              'Users ban list record status with provided new name already exists!',
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
      .mockImplementation(
        (data: { where: { name: string } }): Promise<UsersBanListRecordStatusEntity> => {
          const dto = MockDataStorage.items().find(item => item.name === data.where.name);

          if (!dto) {
            throw new PrismaClientKnownRequestError(
              'Users ban list record status with this name does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          MockDataStorage.setItems(
            MockDataStorage.items().filter(item => item.name !== data.where.name),
          );

          return Promise.resolve({ name: dto.name });
        },
      ),
  },
};
