import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePostAttachmentDto } from 'src/post-attachment/dto/create-post-attachment.dto';
import { UpdatePostAttachmentDto } from 'src/post-attachment/dto/update-post-attachment.dto';
import { PostAttachmentEntity } from 'src/post-attachment/entities/post-attachment.entity';

// Mock data storage
export class MockDataStorage {
  static #data: PostAttachmentEntity[] = [];
  static #defaultData: PostAttachmentEntity[] = [
    { id: '1', file: 'post_attachments/1.jpg', filename: null, resourceType: 'image', postId: '1' },
    {
      id: '2',
      file: 'post_attachments/2.txt',
      filename: 'Document',
      resourceType: 'raw',
      postId: '1',
    },
    { id: '3', file: 'post_attachments/3.mp4', filename: null, resourceType: 'video', postId: '2' },
  ];

  static createPostAttachmentDtoList: CreatePostAttachmentDto[] = [
    { file: 'post_attachments/4.png', filename: null, resourceType: 'image', postId: '1' },
    { file: 'post_attachments/5.txt', filename: null, resourceType: 'raw', postId: '1' },
  ];

  static updatePostAttachmentDtoList: {
    id: string;
    data: UpdatePostAttachmentDto;
  }[] = [
    { id: '1', data: { file: 'post_attachments/4.png', filename: null, resourceType: 'image' } },
    { id: '3', data: { file: 'post_attachments/5.txt', filename: null, resourceType: 'raw' } },
  ];

  static removePostAttachmentDtoList: PostAttachmentEntity[] = [
    { id: '1', file: 'post_attachments/1.jpg', filename: null, resourceType: 'image', postId: '1' },
    { id: '3', file: 'post_attachments/3.mp4', filename: null, resourceType: 'video', postId: '2' },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: PostAttachmentEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockPostAttachmentService = {
  findById: jest.fn().mockImplementation((id: string) => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Post attachment with this id does not exist!');
    }

    return Promise.resolve(dto);
  }),
  update: jest
    .fn()
    .mockImplementation(
      (
        id: string,
        dto: UpdatePostAttachmentDto,
        file: Express.Multer.File,
      ): Promise<PostAttachmentEntity> => {
        let exists = MockDataStorage.items().find(item => item.id === id);

        if (!exists) {
          throw new Error('Post attachment with this id does not exist!');
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
  remove: jest.fn().mockImplementation((id: string): Promise<PostAttachmentEntity> => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Post attachment with this name does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== id));

    return Promise.resolve(dto);
  }),
};

export const mockPostAttachmentRepository = {
  postAttachment: {
    findMany: jest
      .fn()
      .mockImplementation((data?: { where: { postId: string } }) =>
        !data
          ? MockDataStorage.items()
          : MockDataStorage.items().filter(item => item.postId === data.where.postId),
      ),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Post attachment with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
    createMany: jest.fn().mockImplementation((data: { data: CreatePostAttachmentDto[] }) => {
      const created = data.data.map(item => ({ ...item, id: '' }));
      MockDataStorage.items().push(...created);
    }),
    update: jest
      .fn()
      .mockImplementation(
        (dto: {
          where: { id: string };
          data: UpdatePostAttachmentDto;
        }): Promise<PostAttachmentEntity> => {
          let exists = MockDataStorage.items().find(item => item.id === dto.where.id);

          if (!exists) {
            throw new PrismaClientKnownRequestError(
              'Post attachment with this id does not exist!',
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
      .mockImplementation((data: { where: { id: string } }): Promise<PostAttachmentEntity> => {
        const dto = MockDataStorage.items().find(item => item.id === data.where.id);

        if (!dto) {
          throw new PrismaClientKnownRequestError('Post attachment with this id does not exist!', {
            code: 'P2001',
            clientVersion: '',
          });
        }

        MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== data.where.id));

        return Promise.resolve(dto);
      }),
    deleteMany: jest.fn().mockImplementation((data: { where: { postId: string } }) => {
      MockDataStorage.setItems(
        MockDataStorage.items().filter(item => item.postId !== data.where.postId),
      );
    }),
  },
  post: {
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
  },
  $transaction: jest.fn().mockImplementation(callback => callback(mockPostAttachmentRepository)),
};
