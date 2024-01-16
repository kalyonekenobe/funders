import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateCategoriesOnPostsDto } from 'src/categories-on-posts/dto/create-categories-on-posts.dto';
import { CategoriesOnPostsEntity } from 'src/categories-on-posts/entities/categories-on-posts.entity';
import { PostCategoryEntity } from 'src/post-category/entities/post-category.entity';

// Mock data storage
export class MockDataStorage {
  static #data: CategoriesOnPostsEntity[] = [];
  static #defaultData: CategoriesOnPostsEntity[] = [
    { postId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc', category: 'Army' },
    { postId: '940860d0-ea49-40cc-bfb1-82633e0b1b10', category: 'Poor people' },
    { postId: '73c67a90-149e-43d0-966c-91a9a7b3aba3', category: 'Talents' },
    { postId: '793e32be-36a4-4692-8237-fd022f7e1b0d', category: 'Animals' },
    { postId: '793e32be-36a4-4692-8237-fd022f7e1b0d', category: 'Talents' },
    { postId: '793e32be-36a4-4692-8237-fd022f7e1b0d', category: 'Army' },
    { postId: '940860d0-ea49-40cc-bfb1-82633e0b1b10', category: 'Army' },
  ];

  static createCategoriesOnPostsDtoList: { postId: string; data: PostCategoryEntity[] }[] = [
    {
      postId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      data: [{ name: 'Post_Category_1' }, { name: 'Post_Category_2' }, { name: 'Post_Category_4' }],
    },
    {
      postId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      data: [{ name: 'Post_Category_2' }, { name: 'Post_Category_4' }],
    },
    {
      postId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      data: [{ name: 'Post_Category_3' }],
    },
  ];

  static updateCategoriesOnPostsDtoList: {
    postId: string;
    data: PostCategoryEntity[];
  }[] = [
    {
      postId: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      data: [{ name: 'Post_Category_1' }, { name: 'Post_Category_3' }],
    },
  ];

  static removeCategoriesOnPostsDtoList: { postId: string; data: PostCategoryEntity[] }[] = [
    {
      postId: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      data: [{ name: 'Army' }, { name: 'Animals' }],
    },
    {
      postId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      data: [{ name: 'Poor people' }],
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: CategoriesOnPostsEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockCategoriesOnPostsService = {
  findAllPostCategories: jest
    .fn()
    .mockImplementation((postId: string): Promise<PostCategoryEntity[]> => {
      const data = MockDataStorage.items().find(item => item.postId === postId);

      if (!data) {
        throw new Error('Post with this postId does not exist!');
      }

      return Promise.resolve(
        MockDataStorage.items()
          .filter(item => item.postId === postId)
          .map(item => ({ name: item.category })),
      );
    }),
  createPostCategories: jest
    .fn()
    .mockImplementation(
      (postId: string, dto: PostCategoryEntity[]): Promise<PostCategoryEntity[]> => {
        const exists = MockDataStorage.items().find(
          item => item.postId === postId && dto.find(category => category.name === item.category),
        );

        if (exists) {
          throw new Error('CategoryOnPost with this postId and category already exists!');
        }

        dto.forEach(category => MockDataStorage.items().push({ postId, category: category.name }));

        return Promise.resolve(dto);
      },
    ),
  updatePostCategories: jest
    .fn()
    .mockImplementation(
      (postId: string, dto: PostCategoryEntity[]): Promise<PostCategoryEntity[]> => {
        MockDataStorage.setItems(MockDataStorage.items().filter(item => item.postId !== postId));
        dto.forEach(category => MockDataStorage.items().push({ postId, category: category.name }));

        return Promise.resolve(dto);
      },
    ),
  removePostCategories: jest
    .fn()
    .mockImplementation(
      (postId: string, dto: PostCategoryEntity[]): Promise<PostCategoryEntity[]> => {
        dto.forEach(category => {
          if (
            !MockDataStorage.items().find(
              item => category.name === item.category && postId === item.postId,
            )
          ) {
            throw new Error('CategoryOnPost with this postId and category does not exist!');
          }
        });

        MockDataStorage.setItems(
          MockDataStorage.items().filter(
            item =>
              !(item.postId === postId && dto.find(category => category.name === item.category)),
          ),
        );

        return Promise.resolve(dto);
      },
    ),
};

export const mockCategoriesOnPostsRepository = {
  categoriesOnPosts: {
    findMany: jest.fn().mockImplementation((data: { where: { postId: string } }) =>
      Promise.resolve(
        MockDataStorage.items()
          .filter(item => item.postId === data.where.postId)
          .map(item => ({ postCategory: { name: item.category } })),
      ),
    ),
    createMany: jest
      .fn()
      .mockImplementation(
        (dto: { data: CreateCategoriesOnPostsDto[] }): Promise<PostCategoryEntity[]> => {
          const exists = MockDataStorage.items().find(item =>
            dto.data.find(
              categoryOnPost =>
                categoryOnPost.category === item.category && categoryOnPost.postId === item.postId,
            ),
          );

          if (exists) {
            throw new PrismaClientValidationError(
              'CategoryOnPost with this postId and category already exists!',
              {
                clientVersion: '',
              },
            );
          }

          dto.data.forEach(item => MockDataStorage.items().push(item));

          return Promise.resolve(dto.data.map(item => ({ name: item.category })));
        },
      ),
    deleteMany: jest
      .fn()
      .mockImplementation(
        (data: {
          where: { postId?: string; AND?: { postId: string; category: { in: string[] } } };
        }): Promise<PostCategoryEntity[]> => {
          if (data.where.AND) {
            data.where.AND.category.in.forEach(category => {
              if (
                !MockDataStorage.items().find(
                  categoryOnPost =>
                    categoryOnPost.category === category &&
                    categoryOnPost.postId === data.where.AND?.postId,
                )
              ) {
                throw new PrismaClientKnownRequestError(
                  'CategoryOnPost with this postId and category does not exist!',
                  {
                    code: 'P2001',
                    clientVersion: '',
                  },
                );
              }
            });

            MockDataStorage.setItems(
              MockDataStorage.items().filter(
                item =>
                  !(
                    item.postId === data.where.AND?.postId &&
                    data.where.AND.category.in.find(category => category === item.category)
                  ),
              ),
            );

            return Promise.resolve(
              data.where.AND.category.in.map(category => ({ name: category })),
            );
          } else {
            const removedCategories = MockDataStorage.items()
              .filter(item => item.postId === data.where.postId)
              .map(categoryOnPost => ({ name: categoryOnPost.category }));

            MockDataStorage.setItems(
              MockDataStorage.items().filter(item => item.postId !== data.where.postId),
            );

            return Promise.resolve(removedCategories);
          }
        },
      ),
  },
  post: {
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const result = MockDataStorage.items().find(item => item.postId === data.where.id);

      if (!result) {
        throw new PrismaClientKnownRequestError('Post with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(result);
    }),
  },
  $transaction: jest.fn().mockImplementation(callback => callback(mockCategoriesOnPostsRepository)),
};
