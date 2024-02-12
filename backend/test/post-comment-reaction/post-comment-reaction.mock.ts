import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PostCommentReactionEntity } from 'src/post-comment-reaction/entities/post-comment-reaction.entity';
import { CreatePostCommentReactionDto } from 'src/post-comment-reaction/dto/create-post-comment-reaction.dto';
import { UpdatePostCommentReactionDto } from 'src/post-comment-reaction/dto/update-post-comment-reaction.dto';

// Mock data storage
export class MockDataStorage {
  static #data: PostCommentReactionEntity[] = [];
  static #defaultData: PostCommentReactionEntity[] = [
    {
      commentId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      reactionType: 'Like',
      datetime: new Date(),
    },
    {
      commentId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      reactionType: 'Dislike',
      datetime: new Date(),
    },
    {
      commentId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      userId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
      reactionType: 'Dislike',
      datetime: new Date(),
    },
    {
      commentId: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      reactionType: 'Laugh',
      datetime: new Date(),
    },
  ];

  static createPostCommentReactionDtoList: {
    commentId: string;
    data: CreatePostCommentReactionDto;
  }[] = [
    {
      commentId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      data: {
        userId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
        reactionType: 'Anger',
      },
    },
    {
      commentId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      data: {
        userId: '86362221-935b-4b15-a8cb-00be736f1795',
        reactionType: 'Crying',
      },
    },
    {
      commentId: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      data: {
        userId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
        reactionType: 'Heart',
      },
    },
  ];

  static updatePostCommentReactionDtoList: {
    commentId: string;
    userId: string;
    data: UpdatePostCommentReactionDto;
  }[] = [
    {
      commentId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      data: { reactionType: 'Crying' },
    },
    {
      commentId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      data: { reactionType: 'Heart' },
    },
  ];

  static removePostCommentReactionDtoList: PostCommentReactionEntity[] = [
    {
      commentId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      userId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
      reactionType: 'Dislike',
      datetime: new Date(),
    },
    {
      commentId: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      userId: '86362221-935b-4b15-a8cb-00be736f1795',
      reactionType: 'Laugh',
      datetime: new Date(),
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: PostCommentReactionEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockPostCommentReactionService = {
  findAllForComment: jest
    .fn()
    .mockImplementation((commentId: string) =>
      Promise.resolve(MockDataStorage.items().filter(item => item.commentId === commentId)),
    ),
  findAllForUser: jest
    .fn()
    .mockImplementation((userId: string) =>
      Promise.resolve(MockDataStorage.items().filter(item => item.userId === userId)),
    ),
  create: jest
    .fn()
    .mockImplementation(
      (
        commentId: string,
        dto: CreatePostCommentReactionDto,
      ): Promise<PostCommentReactionEntity> => {
        const post = MockDataStorage.items().find(item => item.commentId === commentId);

        if (!post) {
          throw new Error('Post comment with this id does not exist!');
        }

        const exists = MockDataStorage.items().find(
          item => item.userId === dto.userId && item.commentId === commentId,
        );

        if (exists) {
          throw new Error('Post comment reaction with these commentId and userId already exists!');
        }

        const created = { ...dto, commentId, datetime: new Date() };
        MockDataStorage.items().push(created);

        return Promise.resolve(created);
      },
    ),
  update: jest
    .fn()
    .mockImplementation(
      (
        commentId: string,
        userId: string,
        dto: UpdatePostCommentReactionDto,
      ): Promise<PostCommentReactionEntity> => {
        let exists = MockDataStorage.items().find(
          item => item.commentId === commentId && item.userId === userId,
        );

        if (!exists) {
          throw new Error('Post comment reaction with these commentId and userId does not exist!');
        }

        const updated = {
          ...exists,
          ...dto,
        };

        MockDataStorage.setItems(
          MockDataStorage.items().map(item =>
            item.commentId === commentId && item.userId === userId ? updated : item,
          ),
        );

        return Promise.resolve(updated);
      },
    ),
  remove: jest
    .fn()
    .mockImplementation((commentId: string, userId: string): Promise<PostCommentReactionEntity> => {
      const dto = MockDataStorage.items().find(
        item => item.commentId === commentId && item.userId === userId,
      );

      if (!dto) {
        throw new Error('Post comment reaction with these commentId and userId does not exist!');
      }

      MockDataStorage.setItems(
        MockDataStorage.items().filter(
          item => item.commentId !== commentId || item.userId !== userId,
        ),
      );

      return Promise.resolve(dto);
    }),
};

export const mockPostCommentReactionRepository = {
  postCommentReaction: {
    findMany: jest
      .fn()
      .mockImplementation((data: { where: { commentId: string } }) =>
        data
          ? MockDataStorage.items().filter(item => item.commentId === data.where.commentId)
          : MockDataStorage.items(),
      ),
    create: jest
      .fn()
      .mockImplementation(
        (dto: {
          data: CreatePostCommentReactionDto & { commentId: string };
        }): Promise<PostCommentReactionEntity> => {
          const post = MockDataStorage.items().find(item => item.commentId === dto.data.commentId);

          if (!post) {
            throw new PrismaClientKnownRequestError('Post comment with this id does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          const exists = MockDataStorage.items().find(
            item => item.commentId === dto.data.commentId && item.userId === dto.data.userId,
          );

          if (exists) {
            throw new PrismaClientKnownRequestError(
              'Post comment reaction with these commentId and userId already exists!',
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
          where: { commentId_userId: { userId: string; commentId: string } };
          data: UpdatePostCommentReactionDto;
        }): Promise<PostCommentReactionEntity> => {
          const exists = MockDataStorage.items().find(
            item =>
              item.commentId === dto.where.commentId_userId.commentId &&
              item.userId === dto.where.commentId_userId.userId,
          );

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'Post comment reaction with these commentId and userId does not exist!',
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
              item.commentId === dto.where.commentId_userId.commentId &&
              item.userId === dto.where.commentId_userId.userId
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
          where: { commentId_userId: { userId: string; commentId: string } };
        }): Promise<PostCommentReactionEntity> => {
          const dto = MockDataStorage.items().find(
            item =>
              item.commentId === data.where.commentId_userId.commentId &&
              item.userId === data.where.commentId_userId.userId,
          );

          if (!dto) {
            throw new PrismaClientKnownRequestError(
              'Post comment reaction with these commentId and userId does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          MockDataStorage.setItems(
            MockDataStorage.items().filter(
              item =>
                item.commentId !== data.where.commentId_userId.commentId ||
                item.userId !== data.where.commentId_userId.userId,
            ),
          );

          return Promise.resolve(dto);
        },
      ),
  },
  postComment: {
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.commentId === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Post comment with this id does not exist!', {
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
  $transaction: jest
    .fn()
    .mockImplementation(callback => callback(mockPostCommentReactionRepository)),
};
