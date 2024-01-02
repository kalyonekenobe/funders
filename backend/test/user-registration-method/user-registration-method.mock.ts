import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateUserRegistrationMethodDto } from 'src/user-registration-method/dto/create-user-registration-method.dto';
import { UpdateUserRegistrationMethodDto } from 'src/user-registration-method/dto/update-user-registration-method.dto';
import { UserRegistrationMethodEntity } from 'src/user-registration-method/entities/user-registration-method.entity';

// Mock data storage
export class MockDataStorage {
  static #data: UserRegistrationMethodEntity[] = [];
  static #defaultData: UserRegistrationMethodEntity[] = [
    {
      name: 'LinkedIn',
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
          role: 'Administrator',
          firstName: 'Alex',
          lastName: 'Igumnov',
          birthDate: new Date('2004-09-03'),
          email: 'alexigumnov@gmail.com',
          password: 'password',
        },
      ],
    },
    {
      name: 'Instagram',
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
      ],
    },
    {
      name: 'Twitter',
      users: [
        {
          registrationMethod: 'Twitter',
          role: 'Volunteer',
          firstName: 'Vova',
          lastName: 'Havryliuk',
          birthDate: new Date('2003-12-21'),
          email: 'vovahavryliuk@gmail.com',
          password: 'lbmr-6rfm34fr',
        },
      ],
    },
    {
      name: 'Atlassian',
      users: [
        {
          registrationMethod: 'Atlassian',
          role: 'Default',
          firstName: 'Helen',
          lastName: 'Effenberg',
          birthDate: new Date('2004-01-30'),
          email: 'heleneffenberg@gmail.com',
          password: '3fk5mhl70qraza',
        },
      ],
    },
  ];

  static createUserRegistrationMethodDtoList: CreateUserRegistrationMethodDto[] = [
    { name: 'Google' },
    { name: 'Apple' },
    { name: 'Facebook' },
    { name: 'Microsoft' },
  ];

  static updateUserRegistrationMethodDtoList: {
    name: string;
    data: UpdateUserRegistrationMethodDto;
  }[] = [
    { name: 'LinkedIn', data: { name: 'LinkedIn_updated' } },
    { name: 'Instagram', data: { name: 'Instagram_updated' } },
    { name: 'Twitter', data: { name: 'Twitter_updated' } },
    { name: 'Atlassian', data: { name: 'Atlassian_updated' } },
  ];

  static removeUserRegistrationMethodDtoList: UserRegistrationMethodEntity[] = [
    { name: 'LinkedIn' },
    { name: 'Instagram' },
    { name: 'Twitter' },
    { name: 'Atlassian' },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: UserRegistrationMethodEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockUserRegistrationMethodService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve(MockDataStorage.items())),
  findRegisteredUsersByMethodName: jest.fn().mockImplementation((name: string) => {
    const dto = MockDataStorage.items().find(item => item.name === name);

    if (!dto) {
      throw new Error('User registration method with this name does not exist!');
    }

    return Promise.resolve(dto.users);
  }),
  create: jest
    .fn()
    .mockImplementation(
      (dto: CreateUserRegistrationMethodDto): Promise<UserRegistrationMethodEntity> => {
        const exists = MockDataStorage.items().find(item => item.name === dto.name);

        if (exists) {
          throw new Error('User registration method with this name already exists!');
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
        dto: UpdateUserRegistrationMethodDto,
      ): Promise<UserRegistrationMethodEntity> => {
        let exists = MockDataStorage.items().find(item => item.name === name);

        if (!exists) {
          throw new Error('User registration method with this name does not exist!');
        }

        exists = MockDataStorage.items().find(item => item.name === dto.name);

        if (exists) {
          throw new Error('User registration method with provided new name already exists!');
        }

        MockDataStorage.setItems(
          MockDataStorage.items().map(item => (item.name === name ? dto : item)),
        );

        return Promise.resolve(dto);
      },
    ),
  remove: jest.fn().mockImplementation((name: string): Promise<UserRegistrationMethodEntity> => {
    const dto = MockDataStorage.items().find(item => item.name === name);

    if (!dto) {
      throw new Error('User registration method with this name does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.name !== name));

    return Promise.resolve({ name: dto.name });
  }),
};

export const mockUserRegistrationMethodRepository = {
  userRegistrationMethod: {
    findMany: jest.fn().mockImplementation(() => MockDataStorage.items()),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { name: string } }) => {
      const dto = MockDataStorage.items().find(item => item.name === data.where.name);

      if (!dto) {
        throw new PrismaClientKnownRequestError(
          'User registration method with this name does not exist!',
          { code: 'P2001', clientVersion: '' },
        );
      }

      return Promise.resolve(dto);
    }),
    create: jest
      .fn()
      .mockImplementation(
        (dto: { data: CreateUserRegistrationMethodDto }): Promise<UserRegistrationMethodEntity> => {
          const exists = MockDataStorage.items().find(item => item.name === dto.data.name);

          if (exists) {
            throw new PrismaClientValidationError(
              'User registration method with this name already exists!',
              { clientVersion: '' },
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
          data: UpdateUserRegistrationMethodDto;
        }): Promise<UserRegistrationMethodEntity> => {
          let exists = MockDataStorage.items().find(item => item.name === dto.where.name);

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'User registration method with this name does not exist!',
              { code: 'P2001', clientVersion: '' },
            );
          }

          exists = MockDataStorage.items().find(item => item.name === dto.data.name);

          if (exists) {
            throw new PrismaClientValidationError(
              'User registration method with provided new name already exists!',
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
        (data: { where: { name: string } }): Promise<UserRegistrationMethodEntity> => {
          const dto = MockDataStorage.items().find(item => item.name === data.where.name);

          if (!dto) {
            throw new PrismaClientKnownRequestError(
              'User registration method with this name does not exist!',
              { code: 'P2001', clientVersion: '' },
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
