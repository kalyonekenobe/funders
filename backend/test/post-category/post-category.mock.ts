import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreatePostCategoryDto } from 'src/post-category/dto/create-post-category.dto';
import { UpdatePostCategoryDto } from 'src/post-category/dto/update-post-category.dto';
import { PostCategoryEntity } from 'src/post-category/entities/post-category.entity';

// Mock data storage
export class MockDataStorage {
  static #data: PostCategoryEntity[] = [];
  static #defaultData: PostCategoryEntity[] = [
    { name: 'Army' },
    { name: 'Poor people' },
    { name: 'Talents' },
    { name: 'Animals' },
  ];

  static createPostCategoryDtoList: CreatePostCategoryDto[] = [
    { name: 'Post_Category_1' },
    { name: 'Post_Category_2' },
    { name: 'Post_Category_3' },
    { name: 'Post_Category_4' },
  ];

  static updatePostCategoryDtoList: {
    name: string;
    data: UpdatePostCategoryDto;
  }[] = [
    { name: 'Army', data: { name: 'Army_updated' } },
    { name: 'Poor people', data: { name: 'Poor people_updated' } },
    { name: 'Talents', data: { name: 'Talents_updated' } },
    { name: 'Animals', data: { name: 'Animals_updated' } },
  ];

  static removePostCategoryDtoList: PostCategoryEntity[] = [
    { name: 'Army' },
    { name: 'Poor people' },
    { name: 'Talents' },
    { name: 'Animals' },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: PostCategoryEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockPostCategoryService = {
  findAll: jest.fn().mockImplementation(() => Promise.resolve(MockDataStorage.items())),
  create: jest
    .fn()
    .mockImplementation((dto: CreatePostCategoryDto): Promise<PostCategoryEntity> => {
      const exists = MockDataStorage.items().find(item => item.name === dto.name);

      if (exists) {
        throw new Error('Post category with this name already exists!');
      }

      MockDataStorage.items().push(dto);

      return Promise.resolve(dto);
    }),
  update: jest
    .fn()
    .mockImplementation((name: string, dto: UpdatePostCategoryDto): Promise<PostCategoryEntity> => {
      let exists = MockDataStorage.items().find(item => item.name === name);

      if (!exists) {
        throw new Error('Post category with this name does not exist!');
      }

      exists = MockDataStorage.items().find(item => item.name === dto.name);

      if (exists) {
        throw new Error('Post category with provided new name already exists!');
      }

      MockDataStorage.setItems(
        MockDataStorage.items().map(item => (item.name === name ? dto : item)),
      );

      return Promise.resolve(dto);
    }),
  remove: jest.fn().mockImplementation((name: string): Promise<PostCategoryEntity> => {
    const dto = MockDataStorage.items().find(item => item.name === name);

    if (!dto) {
      throw new Error('Post category with this name does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.name !== name));

    return Promise.resolve({ name: dto.name });
  }),
};

export const mockPostCategoryRepository = {
  postCategory: {
    findMany: jest.fn().mockImplementation(() => MockDataStorage.items()),
    create: jest
      .fn()
      .mockImplementation((dto: { data: CreatePostCategoryDto }): Promise<PostCategoryEntity> => {
        const exists = MockDataStorage.items().find(item => item.name === dto.data.name);

        if (exists) {
          throw new PrismaClientValidationError('Post category with this name already exists!', {
            clientVersion: '',
          });
        }

        MockDataStorage.items().push(dto.data);

        return Promise.resolve(dto.data);
      }),
    update: jest
      .fn()
      .mockImplementation(
        (dto: {
          where: { name: string };
          data: UpdatePostCategoryDto;
        }): Promise<PostCategoryEntity> => {
          let exists = MockDataStorage.items().find(item => item.name === dto.where.name);

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'Post category with this name does not exist!',
              { code: 'P2001', clientVersion: '' },
            );
          }

          exists = MockDataStorage.items().find(item => item.name === dto.data.name);

          if (exists) {
            throw new PrismaClientValidationError(
              'Post category with provided new name already exists!',
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
      .mockImplementation((data: { where: { name: string } }): Promise<PostCategoryEntity> => {
        const dto = MockDataStorage.items().find(item => item.name === data.where.name);

        if (!dto) {
          throw new PrismaClientKnownRequestError('Post category with this name does not exist!', {
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
