import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePostCommentAttachmentDto } from 'src/post-comment-attachment/dto/create-post-comment-attachment.dto';
import { UpdatePostCommentAttachmentDto } from 'src/post-comment-attachment/dto/update-post-comment-attachment.dto';
import { PostCommentAttachmentEntity } from 'src/post-comment-attachment/entities/post-comment-attachment.entity';

// Mock data storage
export class MockDataStorage {
  static #data: PostCommentAttachmentEntity[] = [];
  static #defaultData: PostCommentAttachmentEntity[] = [
    {
      id: '1',
      file: 'post_comment_attachments/1.jpg',
      filename: null,
      resourceType: 'image',
      commentId: '1',
    },
    {
      id: '2',
      file: 'post_comment_attachments/2.txt',
      filename: 'Document',
      resourceType: 'raw',
      commentId: '1',
    },
    {
      id: '3',
      file: 'post_comment_attachments/3.mp4',
      filename: null,
      resourceType: 'video',
      commentId: '2',
    },
  ];

  static createPostCommentAttachmentDtoList: CreatePostCommentAttachmentDto[] = [
    {
      file: 'post_comment_attachments/4.png',
      filename: null,
      resourceType: 'image',
      commentId: '1',
    },
    { file: 'post_comment_attachments/5.txt', filename: null, resourceType: 'raw', commentId: '1' },
  ];

  static updatePostCommentAttachmentDtoList: {
    id: string;
    data: UpdatePostCommentAttachmentDto;
  }[] = [
    {
      id: '1',
      data: { file: 'post_comment_attachments/4.png', filename: null, resourceType: 'image' },
    },
    {
      id: '3',
      data: { file: 'post_comment_attachments/5.txt', filename: null, resourceType: 'raw' },
    },
  ];

  static removePostCommentAttachmentDtoList: PostCommentAttachmentEntity[] = [
    {
      id: '1',
      file: 'post_comment_attachments/1.jpg',
      filename: null,
      resourceType: 'image',
      commentId: '1',
    },
    {
      id: '3',
      file: 'post_comment_attachments/3.mp4',
      filename: null,
      resourceType: 'video',
      commentId: '2',
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: PostCommentAttachmentEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockPostCommentAttachmentService = {
  findById: jest.fn().mockImplementation((id: string) => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Post comment attachment with this id does not exist!');
    }

    return Promise.resolve(dto);
  }),
  update: jest
    .fn()
    .mockImplementation(
      (
        id: string,
        dto: UpdatePostCommentAttachmentDto,
        file: Express.Multer.File,
      ): Promise<PostCommentAttachmentEntity> => {
        let exists = MockDataStorage.items().find(item => item.id === id);

        if (!exists) {
          throw new Error('Post comment attachment with this id does not exist!');
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
  remove: jest.fn().mockImplementation((id: string): Promise<PostCommentAttachmentEntity> => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Post comment attachment with this name does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== id));

    return Promise.resolve(dto);
  }),
};

export const mockPostCommentAttachmentRepository = {
  postCommentAttachment: {
    findMany: jest
      .fn()
      .mockImplementation((data?: { where: { commentId: string } }) =>
        !data
          ? MockDataStorage.items()
          : MockDataStorage.items().filter(item => item.commentId === data.where.commentId),
      ),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError(
          'Post comment attachment with this id does not exist!',
          {
            code: 'P2001',
            clientVersion: '',
          },
        );
      }

      return Promise.resolve(dto);
    }),
    createMany: jest.fn().mockImplementation((data: { data: CreatePostCommentAttachmentDto[] }) => {
      const created = data.data.map(item => ({ ...item, id: '' }));
      MockDataStorage.items().push(...created);
    }),
    update: jest
      .fn()
      .mockImplementation(
        (dto: {
          where: { id: string };
          data: UpdatePostCommentAttachmentDto;
        }): Promise<PostCommentAttachmentEntity> => {
          let exists = MockDataStorage.items().find(item => item.id === dto.where.id);

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'Post comment attachment with this id does not exist!',
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
            MockDataStorage.items().map(item => (item.id === dto.where.id ? updated : item)),
          );

          return Promise.resolve(updated);
        },
      ),
    delete: jest
      .fn()
      .mockImplementation(
        (data: { where: { id: string } }): Promise<PostCommentAttachmentEntity> => {
          const dto = MockDataStorage.items().find(item => item.id === data.where.id);

          if (!dto) {
            throw new PrismaClientKnownRequestError(
              'Post comment attachment with this id does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          MockDataStorage.setItems(
            MockDataStorage.items().filter(item => item.id !== data.where.id),
          );

          return Promise.resolve(dto);
        },
      ),
    deleteMany: jest.fn().mockImplementation((data: { where: { commentId: string } }) => {
      MockDataStorage.setItems(
        MockDataStorage.items().filter(item => item.commentId !== data.where.commentId),
      );
    }),
  },
  postComment: {
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Post comment with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
  },
  $transaction: jest
    .fn()
    .mockImplementation(callback => callback(mockPostCommentAttachmentRepository)),
};
