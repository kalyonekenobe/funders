import { Decimal, PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePostReactionDto } from 'src/post-reaction/dto/create-post-reaction.dto';
import { UpdatePostReactionDto } from 'src/post-reaction/dto/update-post-reaction.dto';
import { PostReactionEntity } from 'src/post-reaction/entities/post-reaction.entity';

// Mock data storage
export class MockDataStorage {
  static #data: PostReactionEntity[] = [];
  static #defaultData: PostReactionEntity[] = [
    {
      postId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      reactionType: 'Like',
      datetime: new Date(),
    },
    {
      postId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      reactionType: 'Dislike',
      datetime: new Date(),
    },
    {
      postId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      userId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
      reactionType: 'Dislike',
      datetime: new Date(),
    },
    {
      postId: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      reactionType: 'Laugh',
      datetime: new Date(),
    },
  ];

  static createPostReactionDtoList: { postId: string; data: CreatePostReactionDto }[] = [
    {
      postId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      data: {
        userId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
        reactionType: 'Anger',
      },
    },
    {
      postId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      data: {
        userId: '86362221-935b-4b15-a8cb-00be736f1795',
        reactionType: 'Crying',
      },
    },
    {
      postId: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      data: {
        userId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
        reactionType: 'Heart',
      },
    },
  ];

  static updatePostReactionDtoList: {
    postId: string;
    userId: string;
    data: UpdatePostReactionDto;
  }[] = [
    {
      postId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      data: { reactionType: 'Crying' },
    },
    {
      postId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      data: { reactionType: 'Heart' },
    },
  ];

  static removePostReactionDtoList: PostReactionEntity[] = [
    {
      postId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      userId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
      reactionType: 'Dislike',
      datetime: new Date(),
    },
    {
      postId: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      reactionType: 'Laugh',
      datetime: new Date(),
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: PostReactionEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockPostReactionService = {
  findAllForPost: jest
    .fn()
    .mockImplementation((postId: string) =>
      Promise.resolve(MockDataStorage.items().filter(item => item.postId === postId)),
    ),
  findAllForUser: jest
    .fn()
    .mockImplementation((userId: string) =>
      Promise.resolve(MockDataStorage.items().filter(item => item.userId === userId)),
    ),
  create: jest
    .fn()
    .mockImplementation(
      (postId: string, dto: CreatePostReactionDto): Promise<PostReactionEntity> => {
        const post = MockDataStorage.items().find(item => item.postId === postId);

        if (!post) {
          throw new Error('Post with this id does not exist!');
        }

        const exists = MockDataStorage.items().find(
          item => item.userId === dto.userId && item.postId === postId,
        );

        if (exists) {
          throw new Error('Post reaction with these postId and userId already exists!');
        }

        const created = { ...dto, postId, datetime: new Date() };
        MockDataStorage.items().push(created);

        return Promise.resolve(created);
      },
    ),
  update: jest
    .fn()
    .mockImplementation(
      (postId: string, userId: string, dto: UpdatePostReactionDto): Promise<PostReactionEntity> => {
        let exists = MockDataStorage.items().find(
          item => item.postId === postId && item.userId === userId,
        );

        if (!exists) {
          throw new Error('Post reaction with these postId and userId does not exist!');
        }

        const updated = {
          ...exists,
          ...dto,
        };

        MockDataStorage.setItems(
          MockDataStorage.items().map(item =>
            item.postId === postId && item.userId === userId ? updated : item,
          ),
        );

        return Promise.resolve(updated);
      },
    ),
  remove: jest
    .fn()
    .mockImplementation((postId: string, userId: string): Promise<PostReactionEntity> => {
      const dto = MockDataStorage.items().find(
        item => item.postId === postId && item.userId === userId,
      );

      if (!dto) {
        throw new Error('Post reaction with these postId and userId does not exist!');
      }

      MockDataStorage.setItems(
        MockDataStorage.items().filter(item => item.postId !== postId || item.userId !== userId),
      );

      return Promise.resolve(dto);
    }),
};

export const mockPostReactionRepository = {
  postReaction: {
    findMany: jest
      .fn()
      .mockImplementation((data: { where: { postId: string } }) =>
        data
          ? MockDataStorage.items().filter(item => item.postId === data.where.postId)
          : MockDataStorage.items(),
      ),
    create: jest
      .fn()
      .mockImplementation(
        (dto: {
          data: CreatePostReactionDto & { postId: string };
        }): Promise<PostReactionEntity> => {
          const post = MockDataStorage.items().find(item => item.postId === dto.data.postId);

          if (!post) {
            throw new PrismaClientKnownRequestError('Post with this id does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          const exists = MockDataStorage.items().find(
            item => item.postId === dto.data.postId && item.userId === dto.data.userId,
          );

          if (exists) {
            throw new PrismaClientKnownRequestError(
              'Post reaction with these postId and userId already exists!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          const created = { ...dto.data, datetime: new Date() };
          MockDataStorage.items().push(created);

          return Promise.resolve(created);
        },
      ),
    update: jest
      .fn()
      .mockImplementation(
        (dto: {
          where: { userId_postId: { userId: string; postId: string } };
          data: UpdatePostReactionDto;
        }): Promise<PostReactionEntity> => {
          const exists = MockDataStorage.items().find(
            item =>
              item.postId === dto.where.userId_postId.postId &&
              item.userId === dto.where.userId_postId.userId,
          );

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'Post reaction with these postId and userId does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          const updated = {
            ...exists,
            ...dto.data,
          };

          MockDataStorage.setItems(
            MockDataStorage.items().map(item =>
              item.postId === dto.where.userId_postId.postId &&
              item.userId === dto.where.userId_postId.userId
                ? updated
                : item,
            ),
          );

          return Promise.resolve(updated);
        },
      ),
    delete: jest
      .fn()
      .mockImplementation(
        (data: {
          where: { userId_postId: { userId: string; postId: string } };
        }): Promise<PostReactionEntity> => {
          const dto = MockDataStorage.items().find(
            item =>
              item.postId === data.where.userId_postId.postId &&
              item.userId === data.where.userId_postId.userId,
          );

          if (!dto) {
            throw new PrismaClientKnownRequestError(
              'Post reaction with these postId and userId does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          MockDataStorage.setItems(
            MockDataStorage.items().filter(
              item =>
                item.postId !== data.where.userId_postId.postId ||
                item.userId !== data.where.userId_postId.userId,
            ),
          );

          return Promise.resolve(dto);
        },
      ),
  },
  post: {
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.postId === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Post with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
  },
  user: {
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.userId === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('User with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
  },
  $transaction: jest.fn().mockImplementation(callback => callback(mockPostReactionRepository)),
};
