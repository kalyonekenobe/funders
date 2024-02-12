import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePostCommentDto } from 'src/post-comment/dto/create-post-comment.dto';
import { UpdatePostCommentDto } from 'src/post-comment/dto/update-post-comment.dto';
import { PostCommentEntity } from 'src/post-comment/entities/post-comment.entity';

// Mock data storage
export class MockDataStorage {
  static #data: PostCommentEntity[] = [];
  static #defaultData: PostCommentEntity[] = [
    {
      id: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      postId: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      authorId: '86362221-935b-4b15-a8cb-00be736f1795',
      parentCommentId: null,
      content: `Post comment 1`,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
    {
      id: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      postId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      authorId: '86362221-935b-4b15-a8cb-00be736f1795',
      content: `Post comment 2`,
      parentCommentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
    {
      id: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      postId: '86362221-935b-4b15-a8cb-00be736f1795',
      authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
      content: `Post comment 3`,
      parentCommentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
    {
      id: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      postId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      authorId: '34594f15-8346-4576-a6e1-8c0af156ed86',
      content: `Post comment 4`,
      parentCommentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
    {
      id: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      postId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
      content: `Post comment 5`,
      parentCommentId: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
  ];

  static createPostCommentDtoList: { postId: string; data: CreatePostCommentDto }[] = [
    {
      postId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      data: {
        authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
        parentCommentId: null,
        content: `1`,
        attachments: [],
      },
    },
    {
      postId: '86362221-935b-4b15-a8cb-00be736f1795',
      data: {
        authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
        parentCommentId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
        content: `1`,
        attachments: [],
      },
    },
  ];

  static updatePostCommentDtoList: {
    id: string;
    data: UpdatePostCommentDto;
  }[] = [
    { id: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc', data: { content: 'New content' } },
    { id: '940860d0-ea49-40cc-bfb1-82633e0b1b10', data: { content: 'Edited' } },
    { id: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4', data: { content: 'Aboba' } },
  ];

  static removePostCommentDtoList: PostCommentEntity[] = [
    {
      id: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      postId: '86362221-935b-4b15-a8cb-00be736f1795',
      authorId: '28120570-6539-4abe-8e52-edc697b0ae89',
      content: `Post comment 3`,
      parentCommentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
    {
      id: '793e32be-36a4-4692-8237-fd022f7e1b0d',
      postId: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      authorId: '34594f15-8346-4576-a6e1-8c0af156ed86',
      content: `Post comment 4`,
      parentCommentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      removedAt: null,
      attachments: [],
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: PostCommentEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockPostCommentService = {
  findAllForPost: jest
    .fn()
    .mockImplementation((postId: string) =>
      Promise.resolve(MockDataStorage.items().filter(item => item.postId === postId)),
    ),
  findAllForUser: jest
    .fn()
    .mockImplementation((authorId: string) =>
      Promise.resolve(MockDataStorage.items().filter(item => item.authorId === authorId)),
    ),
  findById: jest.fn().mockImplementation((id: string) => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Post comment comment with this id does not exist!');
    }

    return Promise.resolve(dto);
  }),
  create: jest
    .fn()
    .mockImplementation(
      (postId: string, dto: CreatePostCommentDto, files: unknown): Promise<PostCommentEntity> => {
        const post = MockDataStorage.items().find(item => item.postId === postId);

        if (!post) {
          throw new Error('Post with specified id was not found!');
        }

        const created = {
          ...dto,
          postId,
          id: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          removedAt: null,
        };

        MockDataStorage.items().push(created as any);

        return Promise.resolve(created as any);
      },
    ),
  update: jest
    .fn()
    .mockImplementation(
      (id: string, dto: UpdatePostCommentDto, files: unknown): Promise<PostCommentEntity> => {
        let exists = MockDataStorage.items().find(item => item.id === id);

        if (!exists) {
          throw new Error('Post comment with this id does not exist!');
        }

        const updated = {
          ...exists,
          ...dto,
        };

        MockDataStorage.setItems(
          MockDataStorage.items().map(item => (item.id === id ? updated : item)),
        );

        return Promise.resolve(updated);
      },
    ),
  remove: jest.fn().mockImplementation((id: string): Promise<PostCommentEntity> => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Post comment with this id does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== id));

    return Promise.resolve(dto);
  }),
};

export const mockPostCommentRepository = {
  user: {
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.authorId === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('User with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
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
  postComment: {
    findMany: jest
      .fn()
      .mockImplementation((data?: { where: { authorId?: string; postId?: string } }) => {
        if (!data) {
          return MockDataStorage.items();
        } else {
          return data.where.authorId
            ? MockDataStorage.items().filter(item => item.authorId === data.where.authorId)
            : MockDataStorage.items().filter(item => item.postId === data.where.postId);
        }
      }),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Post with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
    create: jest
      .fn()
      .mockImplementation(
        (dto: { data: CreatePostCommentDto & { postId: string } }): Promise<PostCommentEntity> => {
          const post = MockDataStorage.items().find(item => item.postId === dto.data.postId);

          if (!post) {
            throw new PrismaClientKnownRequestError('Post with this id does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          const created = {
            ...dto.data,
            postId: dto.data.postId,
            id: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            removedAt: null,
            attachments: [],
          };

          MockDataStorage.items().push(created);

          return Promise.resolve(created);
        },
      ),
    update: jest
      .fn()
      .mockImplementation(
        (dto: {
          where: { id: string };
          data: UpdatePostCommentDto;
        }): Promise<PostCommentEntity> => {
          let exists = MockDataStorage.items().find(item => item.id === dto.where.id);

          if (!exists) {
            throw new PrismaClientKnownRequestError('Post comment with this id does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
          }

          const updated = {
            ...exists,
            ...{ ...dto.data, attachments: [] },
          };

          MockDataStorage.setItems(
            MockDataStorage.items().map(item => (item.id === dto.where.id ? updated : item)),
          );

          return Promise.resolve(updated);
        },
      ),
    delete: jest
      .fn()
      .mockImplementation((data: { where: { id: string } }): Promise<PostCommentEntity> => {
        const dto = MockDataStorage.items().find(item => item.id === data.where.id);

        if (!dto) {
          throw new PrismaClientKnownRequestError('Post comment this id does not exist!', {
            code: 'P2001',
            clientVersion: '',
          });
        }

        MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== data.where.id));

        return Promise.resolve(dto);
      }),
  },
  postCommentAttachment: {
    findMany: jest.fn().mockImplementation(() => []),
  },
  $transaction: jest.fn().mockImplementation(callback => callback(mockPostCommentRepository)),
};
