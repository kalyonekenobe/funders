import { Decimal, PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePostDonationDto } from 'src/post-donation/dto/create-post-donation.dto';
import { UpdatePostDonationDto } from 'src/post-donation/dto/update-post-donation.dto';
import { PostDonationEntity } from 'src/post-donation/entities/post-donation.entity';

// Mock data storage
export class MockDataStorage {
  static #data: PostDonationEntity[] = [];
  static #defaultData: PostDonationEntity[] = [
    {
      id: '73c67a90-149e-43d0-966c-91a9a7b3aba3',
      postId: '86362221-935b-4b15-a8cb-00be736f1795',
      cardNumber: '4651959430571585',
      donation: new Decimal(1200),
      datetime: new Date(),
    },
    {
      id: '940860d0-ea49-40cc-bfb1-82633e0b1b10',
      postId: '86362221-935b-4b15-a8cb-00be736f1795',
      cardNumber: '5684068403860256',
      donation: new Decimal(4495),
      datetime: new Date(),
    },
    {
      id: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      postId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
      cardNumber: '1058674969476571',
      donation: new Decimal(300),
      datetime: new Date(),
    },
    {
      id: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      postId: '86362221-935b-4b15-a8cb-00be736f1795',
      cardNumber: '6965394867570345',
      donation: new Decimal(45.98),
      datetime: new Date(),
    },
  ];

  static createPostDonationDtoList: { postId: string; data: CreatePostDonationDto }[] = [
    {
      postId: '86362221-935b-4b15-a8cb-00be736f1795',
      data: {
        cardNumber: '1058674969476571',
        donation: new Decimal(300),
      },
    },
    {
      postId: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      data: {
        cardNumber: '6965394867570345',
        donation: new Decimal(400),
      },
    },
    {
      postId: '86362221-935b-4b15-a8cb-00be736f1795',
      data: {
        cardNumber: '6965394867570345',
        donation: new Decimal(500),
      },
    },
  ];

  static updatePostDonationDtoList: {
    id: string;
    data: UpdatePostDonationDto;
  }[] = [
    { id: '73c67a90-149e-43d0-966c-91a9a7b3aba3', data: { donation: new Decimal(800) } },
    { id: '940860d0-ea49-40cc-bfb1-82633e0b1b10', data: { cardNumber: '6965394867570345' } },
  ];

  static removePostDonationDtoList: PostDonationEntity[] = [
    {
      id: 'f7ce3ef8-b4fa-43af-b2b9-ae2a4caf65fc',
      postId: '0ae05c9a-0388-47cc-9b26-b8c1085bcf68',
      cardNumber: '1058674969476571',
      donation: new Decimal(300),
      datetime: new Date(),
    },
    {
      id: 'f5ccff87-1339-49c7-b87f-0fa80580c5d4',
      postId: '86362221-935b-4b15-a8cb-00be736f1795',
      cardNumber: '6965394867570345',
      donation: new Decimal(45.98),
      datetime: new Date(),
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: PostDonationEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockPostDonationService = {
  findAllForPost: jest
    .fn()
    .mockImplementation((postId: string) =>
      Promise.resolve(MockDataStorage.items().filter(item => item.postId === postId)),
    ),
  findById: jest.fn().mockImplementation((id: string): Promise<PostDonationEntity> => {
    const exists = MockDataStorage.items().find(item => item.id === id);

    if (!exists) {
      throw new Error('Post donation with this id does not exist!');
    }

    return Promise.resolve(exists);
  }),
  create: jest
    .fn()
    .mockImplementation(
      (postId: string, dto: CreatePostDonationDto): Promise<PostDonationEntity> => {
        const created = { ...dto, postId, id: '', datetime: new Date() };
        MockDataStorage.items().push(created);

        return Promise.resolve(created);
      },
    ),
  update: jest
    .fn()
    .mockImplementation((id: string, dto: UpdatePostDonationDto): Promise<PostDonationEntity> => {
      let exists = MockDataStorage.items().find(item => item.id === id);

      if (!exists) {
        throw new Error('Post donation with this id does not exist!');
      }

      const updated = {
        ...exists,
        ...dto,
      };

      MockDataStorage.setItems(
        MockDataStorage.items().map(item => (item.id === id ? updated : item)),
      );

      return Promise.resolve(updated);
    }),
  remove: jest.fn().mockImplementation((id: string): Promise<PostDonationEntity> => {
    const dto = MockDataStorage.items().find(item => item.id === id);

    if (!dto) {
      throw new Error('Post donation with this id does not exist!');
    }

    MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== id));

    return Promise.resolve(dto);
  }),
};

export const mockPostDonationRepository = {
  postDonation: {
    findMany: jest
      .fn()
      .mockImplementation((data: { where: { postId: string } }) =>
        data
          ? MockDataStorage.items().filter(item => item.postId === data.where.postId)
          : MockDataStorage.items(),
      ),
    findUniqueOrThrow: jest.fn().mockImplementation((data: { where: { id: string } }) => {
      const dto = MockDataStorage.items().find(item => item.id === data.where.id);

      if (!dto) {
        throw new PrismaClientKnownRequestError('Post donation with this id does not exist!', {
          code: 'P2001',
          clientVersion: '',
        });
      }

      return Promise.resolve(dto);
    }),
    create: jest
      .fn()
      .mockImplementation(
        (dto: {
          data: CreatePostDonationDto & { postId: string };
        }): Promise<PostDonationEntity> => {
          const created = { ...dto.data, id: '', datetime: new Date() };
          MockDataStorage.items().push(created);

          return Promise.resolve(created);
        },
      ),
    update: jest
      .fn()
      .mockImplementation(
        (dto: {
          where: { id: string };
          data: UpdatePostDonationDto;
        }): Promise<PostDonationEntity> => {
          const exists = MockDataStorage.items().find(item => item.id === dto.where.id);

          if (!exists) {
            throw new PrismaClientKnownRequestError('Post donation with this id does not exist!', {
              code: 'P2001',
              clientVersion: '',
            });
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
      .mockImplementation((data: { where: { id: string } }): Promise<PostDonationEntity> => {
        const dto = MockDataStorage.items().find(item => item.id === data.where.id);

        if (!dto) {
          throw new PrismaClientKnownRequestError('Post donation with this id does not exist!', {
            code: 'P2001',
            clientVersion: '',
          });
        }

        MockDataStorage.setItems(MockDataStorage.items().filter(item => item.id !== data.where.id));

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
  $transaction: jest.fn().mockImplementation(callback => callback(mockPostDonationRepository)),
};
