import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateUserRoleDto } from 'src/user-role/dto/create-user-role.dto';
import { UpdateUserRoleDto } from 'src/user-role/dto/update-user-role.dto';
import { UserRoleEntity } from 'src/user-role/entities/user-role.entity';

// Mock data storage
export class MockDataStorage {
  static #data: UserRoleEntity[] = [];
  static #defaultData: UserRoleEntity[] = [
    {
      name: 'Default',
      permissions: BigInt(15),
      users: [
        {
          registrationMethod: 'LinkedIn',
          role: 'Default',
          firstName: 'John',
          lastName: 'Doe',
          birthDate: new Date('1996-07-04'),
          email: 'johndoe@gmail.com',
          password: '123456',
        },
        {
          registrationMethod: 'LinkedIn',
          role: 'Default',
          firstName: 'Alex',
          lastName: 'Igumnov',
          birthDate: new Date('2004-09-03'),
          email: 'alexigumnov@gmail.com',
          password: 'password',
        },
      ],
    },
    {
      name: 'Volunteer',
      permissions: BigInt(127),
      users: [
        {
          registrationMethod: 'Instagram',
          role: 'Volunteer',
          firstName: 'Samantha',
          lastName: 'Jones',
          birthDate: new Date('1999-03-17'),
          email: 'samanthajones@gmail.com',
          password: 'fkj14mf50t',
        },
        {
          registrationMethod: 'Atlassian',
          role: 'Volunteer',
          firstName: 'Helen',
          lastName: 'Effenberg',
          birthDate: new Date('2004-01-30'),
          email: 'heleneffenberg@gmail.com',
          password: '3fk5mhl70qraza',
        },
      ],
    },
    {
      name: 'Administrator',
      permissions: BigInt(255),
      users: [
        {
          registrationMethod: 'Twitter',
          role: 'Administrator',
          firstName: 'Vova',
          lastName: 'Havryliuk',
          birthDate: new Date('2003-12-21'),
          email: 'vovahavryliuk@gmail.com',
          password: 'lbmr-6rfm34fr',
        },
      ],
    },
  ];

  static createUserRoleDtoList: CreateUserRoleDto[] = [
    { name: 'Role_1', permissions: BigInt(15) },
    { name: 'Role_2', permissions: BigInt(127) },
    { name: 'Role_3', permissions: BigInt(255) },
  ];

  static updateUserRoleDtoList: {
    name: string;
    data: UpdateUserRoleDto;
  }[] = [
    { name: 'Default', data: { name: 'Default_updated', permissions: BigInt(15) } },
    { name: 'Volunteer', data: { name: 'Volunteer_updated', permissions: BigInt(127) } },
    { name: 'Administrator', data: { name: 'Administrator_updated', permissions: BigInt(255) } },
  ];

  static removeUserRoleDtoList: UserRoleEntity[] = [
    { name: 'Default', permissions: BigInt(15) },
    { name: 'Volunteer', permissions: BigInt(127) },
    { name: 'Administrator', permissions: BigInt(255) },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: UserRoleEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockUserRoleService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve(MockDataStorage.items())),
  findUsersWithRole: jest.fn().mockImplementation((name: string) => {
    const dto = MockDataStorage.items().find(item => item.name === name);

    if (!dto) {
      throw new Error('User role with this name does not exist!');
    }

    return Promise.resolve(dto.users);
  }),
  create: jest.fn().mockImplementation((dto: CreateUserRoleDto): Promise<UserRoleEntity> => {
    const exists = MockDataStorage.items().find(item => item.name === dto.name);

    if (exists) {
      throw new Error('User role with this name already exists!');
    }

    MockDataStorage.items().push(dto);

    return Promise.resolve(dto);
  }),
  update: jest
    .fn()
    .mockImplementation((name: string, dto: UpdateUserRoleDto): Promise<UserRoleEntity> => {
      let exists = MockDataStorage.items().find(item => item.name === name);

      if (!exists) {
        throw new Error('User role with this name does not exist!');
      }

      exists = MockDataStorage.items().find(item => item.name === dto.name);

      if (exists) {
        throw new Error('User role with provided new name already exists!');
      }

      MockDataStorage.setItems(
        MockDataStorage.items().map(item => (item.name === name ? dto : item)),
      );

      return Promise.resolve(dto);
    }),
  remove: jest.fn().mockImplementation((name: string): Promise<UserRoleEntity> => {
    const dto = MockDataStorage.items().find(item => item.name === name);

    if (!dto) {
      throw new Error('User role with this name does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.name !== name));

    return Promise.resolve({ name: dto.name, permissions: dto.permissions });
  }),
};

export const mockUserRoleRepository = {
  userRole: {
    findMany: jest.fn().mockImplementation(() => MockDataStorage.items()),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { name: string } }) => {
      const dto = MockDataStorage.items().find(item => item.name === data.where.name);

      if (!dto) {
        throw new PrismaClientKnownRequestError('User role with this name does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
    create: jest
      .fn()
      .mockImplementation((dto: { data: CreateUserRoleDto }): Promise<UserRoleEntity> => {
        const exists = MockDataStorage.items().find(item => item.name === dto.data.name);

        if (exists) {
          throw new PrismaClientValidationError('User role with this name already exists!', {
            clientVersion: '',
          });
        }

        MockDataStorage.items().push(dto.data);

        return Promise.resolve(dto.data);
      }),
    update: jest
      .fn()
      .mockImplementation(
        (dto: { where: { name: string }; data: UpdateUserRoleDto }): Promise<UserRoleEntity> => {
          let exists = MockDataStorage.items().find(item => item.name === dto.where.name);

          if (!exists) {
            throw new PrismaClientKnownRequestError('User role with this name does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          exists = MockDataStorage.items().find(item => item.name === dto.data.name);

          if (exists) {
            throw new PrismaClientValidationError(
              'User role with provided new name already exists!',
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
      .mockImplementation((data: { where: { name: string } }): Promise<UserRoleEntity> => {
        const dto = MockDataStorage.items().find(item => item.name === data.where.name);

        if (!dto) {
          throw new PrismaClientKnownRequestError('User role with this name does not exist!', {
            code: 'P2001',
            clientVersion: '',
          });
        }

        MockDataStorage.setItems(
          MockDataStorage.items().filter(item => item.name !== data.where.name),
        );

        return Promise.resolve({ name: dto.name, permissions: dto.permissions });
      }),
  },
};
