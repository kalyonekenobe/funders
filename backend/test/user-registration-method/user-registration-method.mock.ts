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
          stripeCustomerId: 'cus_NffrFeUfNV2Hib',
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
          stripeCustomerId: 'cus_NffrFeUfNV2Hib',
          registeredAt: new Date(),
        },
      ],
    },
    {
      name: 'Instagram',
      users: [
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
          stripeCustomerId: 'cus_NffrFeUfNV2Hib',
          registeredAt: new Date(),
        },
      ],
    },
    {
      name: 'Twitter',
      users: [
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
          stripeCustomerId: 'cus_NffrFeUfNV2Hib',
          registeredAt: new Date(),
        },
      ],
    },
    {
      name: 'Atlassian',
      users: [
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
          stripeCustomerId: 'cus_NffrFeUfNV2Hib',
          registeredAt: new Date(),
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
