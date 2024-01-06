import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateUserReactionTypeDto } from 'src/user-reaction-type/dto/create-user-reaction-type.dto';
import { UpdateUserReactionTypeDto } from 'src/user-reaction-type/dto/update-user-reaction-type.dto';
import { UserReactionTypeEntity } from 'src/user-reaction-type/entities/user-reaction-type.entity';

// Mock data storage
export class MockDataStorage {
  static #data: UserReactionTypeEntity[] = [];
  static #defaultData: UserReactionTypeEntity[] = [
    { name: 'Like' },
    { name: 'Dislike' },
    { name: 'Heart' },
    { name: 'Crying' },
    { name: 'Anger' },
    { name: 'Laugh' },
  ];

  static createUserRactionTypeDtoList: CreateUserReactionTypeDto[] = [
    { name: 'Reaction_1' },
    { name: 'Reaction_2' },
    { name: 'Reaction_3' },
    { name: 'Reaction_4' },
  ];

  static updateUserReactionTypeDtoList: {
    name: string;
    data: UpdateUserReactionTypeDto;
  }[] = [
    { name: 'Like', data: { name: 'Like_updated' } },
    { name: 'Dislike', data: { name: 'Dislike_updated' } },
    { name: 'Heart', data: { name: 'Heart_updated' } },
    { name: 'Anger', data: { name: 'Anger_updated' } },
  ];

  static removeUserReactionTypeDtoList: UserReactionTypeEntity[] = [
    { name: 'Like' },
    { name: 'Dislike' },
    { name: 'Heart' },
    { name: 'Crying' },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: UserReactionTypeEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockUserReactionTypeService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve(MockDataStorage.items())),
  create: jest
    .fn()
    .mockImplementation((dto: CreateUserReactionTypeDto): Promise<UserReactionTypeEntity> => {
      const exists = MockDataStorage.items().find(item => item.name === dto.name);

      if (exists) {
        throw new Error('User reaction type with this name already exists!');
      }

      MockDataStorage.items().push(dto);

      return Promise.resolve(dto);
    }),
  update: jest
    .fn()
    .mockImplementation(
      (name: string, dto: UpdateUserReactionTypeDto): Promise<UserReactionTypeEntity> => {
        let exists = MockDataStorage.items().find(item => item.name === name);

        if (!exists) {
          throw new Error('User reaction type with this name does not exist!');
        }

        exists = MockDataStorage.items().find(item => item.name === dto.name);

        if (exists) {
          throw new Error('User reaction type with provided new name already exists!');
        }

        MockDataStorage.setItems(
          MockDataStorage.items().map(item => (item.name === name ? dto : item)),
        );

        return Promise.resolve(dto);
      },
    ),
  remove: jest.fn().mockImplementation((name: string): Promise<UserReactionTypeEntity> => {
    const dto = MockDataStorage.items().find(item => item.name === name);

    if (!dto) {
      throw new Error('User reaction type with this name does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.name !== name));

    return Promise.resolve({ name: dto.name });
  }),
};

export const mockUserReactionTypeRepository = {
  userReactionType: {
    findMany: jest.fn().mockImplementation(() => MockDataStorage.items()),
    create: jest
      .fn()
      .mockImplementation(
        (dto: { data: CreateUserReactionTypeDto }): Promise<UserReactionTypeEntity> => {
          const exists = MockDataStorage.items().find(item => item.name === dto.data.name);

          if (exists) {
            throw new PrismaClientValidationError(
              'User reaction type with this name already exists!',
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
          data: UpdateUserReactionTypeDto;
        }): Promise<UserReactionTypeEntity> => {
          let exists = MockDataStorage.items().find(item => item.name === dto.where.name);

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'User reaction type with this name does not exist!',
              { code: 'P2001', clientVersion: '' },
            );
          }

          exists = MockDataStorage.items().find(item => item.name === dto.data.name);

          if (exists) {
            throw new PrismaClientValidationError(
              'User reaction type with provided new name already exists!',
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
      .mockImplementation((data: { where: { name: string } }): Promise<UserReactionTypeEntity> => {
        const dto = MockDataStorage.items().find(item => item.name === data.where.name);

        if (!dto) {
          throw new PrismaClientKnownRequestError(
            'User reaction type with this name does not exist!',
            { code: 'P2001', clientVersion: '' },
          );
        }

        MockDataStorage.setItems(
          MockDataStorage.items().filter(item => item.name !== data.where.name),
        );

        return Promise.resolve({ name: dto.name });
      }),
  },
};
