import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUsersBanListRecordDto } from 'src/users-ban-list-record/dto/create-users-ban-list-record.dto';
import { UsersBanListRecordEntity } from 'src/users-ban-list-record/entities/users-ban-list-record.entity';
import { MockDataStorage as BanMockDataStorage } from 'test/users-ban-list-record/users-ban-list-record.mock';

// Mock data storage
export class MockDataStorage {
  static #data: UserPublicEntity[] = [];
  static #defaultData: UserPublicEntity[] = [
    {
      id: 'b7af9cd4-5533-4737-862b-78bce985c987',
      registrationMethod: 'LinkedIn',
      role: 'Default',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1996-07-04'),
      email: 'johndoe@gmail.com',
      phone: null,
      bio: null,
      avatar: null,
      refreshToken: null,
      registeredAt: new Date(),
    },
    {
      id: '989d32c2-abd4-43d3-a420-ee175ae16b98',
      registrationMethod: 'LinkedIn',
      role: 'Administrator',
      firstName: 'Alex',
      lastName: 'Igumnov',
      birthDate: new Date('2004-09-03'),
      email: 'alexigumnov@gmail.com',
      phone: null,
      bio: null,
      avatar: null,
      refreshToken: null,
      registeredAt: new Date(),
    },
    {
      id: '34f79b86-2151-4483-838f-0a0ed586a621',
      registrationMethod: 'Instagram',
      role: 'Volunteer',
      firstName: 'Samantha',
      lastName: 'Jones',
      birthDate: new Date('1999-03-17'),
      email: 'samanthajones@gmail.com',
      phone: null,
      bio: null,
      avatar: null,
      refreshToken: null,
      registeredAt: new Date(),
    },
    {
      id: '26e6fdab-bbf8-4500-b78b-56378421b230',
      registrationMethod: 'Twitter',
      role: 'Volunteer',
      firstName: 'Vova',
      lastName: 'Havryliuk',
      birthDate: new Date('2003-12-21'),
      email: 'vovahavryliuk@gmail.com',
      phone: null,
      bio: null,
      avatar: null,
      refreshToken: null,
      registeredAt: new Date(),
    },
    {
      id: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f',
      registrationMethod: 'Atlassian',
      role: 'Default',
      firstName: 'Helen',
      lastName: 'Effenberg',
      birthDate: new Date('2004-01-30'),
      email: 'heleneffenberg@gmail.com',
      phone: null,
      bio: null,
      avatar: null,
      refreshToken: null,
      registeredAt: new Date(),
    },
  ];

  static createUserDtoList: CreateUserDto[] = [
    {
      registrationMethod: 'Atlassian',
      role: 'Default',
      firstName: 'Oleksandr',
      lastName: 'Shved',
      birthDate: new Date('1974-11-14'),
      email: 'oleksandrshved@gmail.com',
      password: 'password',
    },
    {
      registrationMethod: 'Atlassian',
      role: 'Default',
      firstName: 'Margaret',
      lastName: 'Johansenn',
      birthDate: new Date('2007-04-06'),
      email: 'margaretjohansenn@gmail.com',
      password: 'password',
    },
  ];

  static updateUserDtoList: {
    id: string;
    data: UpdateUserDto;
  }[] = [
    { id: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f', data: { firstName: 'Alex' } },
    { id: '26e6fdab-bbf8-4500-b78b-56378421b230', data: { lastName: 'Boba' } },
    { id: '989d32c2-abd4-43d3-a420-ee175ae16b98', data: { password: 'jasnfjasbfbasfbsahfbhas' } },
  ];

  static removeUserDtoList: UserPublicEntity[] = [
    {
      id: '34f79b86-2151-4483-838f-0a0ed586a621',
      registrationMethod: 'Instagram',
      role: 'Volunteer',
      firstName: 'Samantha',
      lastName: 'Jones',
      birthDate: new Date('1999-03-17'),
      email: 'samanthajones@gmail.com',
      phone: null,
      bio: null,
      avatar: null,
      refreshToken: null,
      registeredAt: new Date(),
    },
    {
      id: '26e6fdab-bbf8-4500-b78b-56378421b230',
      registrationMethod: 'Twitter',
      role: 'Volunteer',
      firstName: 'Vova',
      lastName: 'Havryliuk',
      birthDate: new Date('2003-12-21'),
      email: 'vovahavryliuk@gmail.com',
      phone: null,
      bio: null,
      avatar: null,
      refreshToken: null,
      registeredAt: new Date(),
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: UserPublicEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockUserService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve(MockDataStorage.items())),
  findById: jest.fn().mockImplementation((id: string) => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('User with this id does not exist!');
    }

    return Promise.resolve(dto);
  }),
  findAllUserBans: jest
    .fn()
    .mockImplementation((userId: string) =>
      Promise.resolve(BanMockDataStorage.items().filter(item => item.userId === userId)),
    ),
  createUsersBanListRecord: jest
    .fn()
    .mockImplementation((dto: CreateUsersBanListRecordDto): Promise<UsersBanListRecordEntity> => {
      const created = {
        ...dto,
        id: '',
        bannedAt: new Date(),
      };

      BanMockDataStorage.items().push(created);

      return Promise.resolve(created);
    }),
  create: jest.fn().mockImplementation((dto: CreateUserDto): Promise<UserPublicEntity> => {
    const exists = MockDataStorage.items().find(item => item.email === dto.email);

    if (exists) {
      throw new Error('User with this email already exists!');
    }

    const created = {
      ...dto,
      bio: null,
      avatar: null,
      id: '',
      phone: null,
      refreshToken: null,
      registeredAt: new Date(),
    } as Partial<UserEntity>;

    delete created.password;

    MockDataStorage.items().push(created as UserPublicEntity);

    return Promise.resolve(created as UserPublicEntity);
  }),
  update: jest
    .fn()
    .mockImplementation((id: string, dto: UpdateUserDto): Promise<UserPublicEntity> => {
      let exists = MockDataStorage.items().find(item => item.id === id);

      if (!exists) {
        throw new Error('User with this id does not exist!');
      }

      const updated = { ...exists, ...dto };

      MockDataStorage.setItems(
        MockDataStorage.items().map(item =>
          item.id === id ? (updated as UserPublicEntity) : item,
        ),
      );

      return Promise.resolve(updated as UserPublicEntity);
    }),
  remove: jest.fn().mockImplementation((id: string): Promise<UserPublicEntity> => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('User with this id does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== id));

    return Promise.resolve(dto);
  }),
};

export const mockUserRepository = {
  user: {
    findMany: jest.fn().mockImplementation(() => MockDataStorage.items()),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('User with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
    create: jest
      .fn()
      .mockImplementation((dto: { data: CreateUserDto }): Promise<UserPublicEntity> => {
        const exists = MockDataStorage.items().find(item => item.email === dto.data.email);

        if (exists) {
          throw new PrismaClientValidationError('User with this email already exists!', {
            clientVersion: '',
          });
        }

        const created = {
          ...dto.data,
          bio: null,
          avatar: null,
          id: '',
          phone: null,
          refreshToken: null,
          registeredAt: new Date(),
        } as Partial<UserEntity>;

        delete created.password;

        MockDataStorage.items().push(created as UserPublicEntity);

        return Promise.resolve(created as UserPublicEntity);
      }),
    update: jest
      .fn()
      .mockImplementation(
        (dto: { where: { id: string }; data: UpdateUserDto }): Promise<UserPublicEntity> => {
          let exists = MockDataStorage.items().find(item => item.id === dto.where.id);

          if (!exists) {
            throw new PrismaClientKnownRequestError('User with this id does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          const updated = { ...exists, ...dto.data };

          MockDataStorage.setItems(
            MockDataStorage.items().map(item =>
              item.id === dto.where.id ? (updated as UserPublicEntity) : item,
            ),
          );

          return Promise.resolve(updated as UserPublicEntity);
        },
      ),
    delete: jest
      .fn()
      .mockImplementation((data: { where: { id: string } }): Promise<UserPublicEntity> => {
        const dto = MockDataStorage.items().find(item => item.id === data.where.id);

        if (!dto) {
          throw new PrismaClientKnownRequestError('User this id does not exist!', {
            code: 'P2001',
            clientVersion: '',
          });
        }

        MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== data.where.id));

        return Promise.resolve(dto);
      }),
  },
};
