import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateFollowingDto } from 'src/following/dto/create-following.dto';
import { FollowingEntity } from 'src/following/entities/following.entity';

// Mock data storage
export class MockDataStorage {
  static #data: FollowingEntity[] = [];
  static #defaultData: FollowingEntity[] = [
    {
      userId: 'b7af9cd4-5533-4737-862b-78bce985c987',
      followerId: '989d32c2-abd4-43d3-a420-ee175ae16b98',
    },
    {
      userId: '34f79b86-2151-4483-838f-0a0ed586a621',
      followerId: '26e6fdab-bbf8-4500-b78b-56378421b230',
    },
    {
      userId: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f',
      followerId: '26e6fdab-bbf8-4500-b78b-56378421b230',
    },
    {
      userId: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f',
      followerId: '34f79b86-2151-4483-838f-0a0ed586a621',
    },
    {
      userId: '34f79b86-2151-4483-838f-0a0ed586a621',
      followerId: 'b7af9cd4-5533-4737-862b-78bce985c987',
    },
    {
      userId: '26e6fdab-bbf8-4500-b78b-56378421b230',
      followerId: '34f79b86-2151-4483-838f-0a0ed586a621',
    },
  ];

  static createFollowingDtoList: CreateFollowingDto[] = [
    {
      userId: '26e6fdab-bbf8-4500-b78b-56378421b2301',
      followerId: '34f79b86-2151-4483-838f-0a0ed586a6211',
    },
    {
      userId: '26e6fdab-bbf8-4500-b78b-56378421b2320',
      followerId: '34f79b86-2151-4483-838f-0a0ed586a6221',
    },
  ];

  static removeFollowingDtoList: FollowingEntity[] = [
    {
      userId: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f',
      followerId: '26e6fdab-bbf8-4500-b78b-56378421b230',
    },
    {
      userId: '23fbed56-1bb9-40a0-8977-2dd0f0c6c31f',
      followerId: '34f79b86-2151-4483-838f-0a0ed586a621',
    },
  ];

  static items() {
    return MockDataStorage.#data;
  }

  static setItems(data: FollowingEntity[]) {
    MockDataStorage.#data = [...data];
  }

  static setDefaultItems() {
    MockDataStorage.#data = [...MockDataStorage.#defaultData];
  }
}

export const mockFollowingService = {
  findAllUserFollowings: jest.fn().mockImplementation((userId: string) => {
    const data = MockDataStorage.items().find(item => item.followerId === userId);

    if (!data) {
      throw new Error('Following with this userId and followerId does not exist!');
    }

    return Promise.resolve(MockDataStorage.items().filter(item => item.followerId === userId));
  }),
  findAllUserFollowers: jest.fn().mockImplementation((userId: string) => {
    const data = MockDataStorage.items().find(item => item.userId === userId);

    if (!data) {
      throw new Error('Following with this userId and followerId does not exist!');
    }

    return Promise.resolve(MockDataStorage.items().filter(item => item.userId === userId));
  }),
  create: jest.fn().mockImplementation((dto: CreateFollowingDto): Promise<FollowingEntity> => {
    const exists = MockDataStorage.items().find(item => item.userId === dto.userId);

    if (exists) {
      throw new Error('Following with this userId and followerId already exists!');
    }

    MockDataStorage.items().push(dto);

    return Promise.resolve(dto);
  }),
  remove: jest
    .fn()
    .mockImplementation((userId: string, followerId: string): Promise<FollowingEntity> => {
      const dto = MockDataStorage.items().find(
        item => item.userId === userId && item.followerId === followerId,
      );

      if (!dto) {
        throw new Error('Following with this userId and followerId does not exist!');
      }

      MockDataStorage.setItems(
        MockDataStorage.items().filter(
          item => item.userId !== userId || item.followerId !== followerId,
        ),
      );

      return Promise.resolve(dto);
    }),
};

export const mockFollowingRepository = {
  following: {
    findMany: jest
      .fn()
      .mockImplementation(data =>
        Promise.resolve([
          { user: MockDataStorage.items()[4], follower: MockDataStorage.items()[0] },
        ]),
      ),
    create: jest
      .fn()
      .mockImplementation((dto: { data: CreateFollowingDto }): Promise<FollowingEntity> => {
        const exists = MockDataStorage.items().find(
          item => item.userId === dto.data.userId && item.followerId === dto.data.followerId,
        );

        if (exists) {
          throw new PrismaClientValidationError(
            'Following with this userId and followerId already exists!',
            {
              clientVersion: '',
            },
          );
        }

        MockDataStorage.items().push(dto.data);

        return Promise.resolve(dto.data);
      }),
    delete: jest
      .fn()
      .mockImplementation(
        (data: {
          where: { userId_followerId: { userId: string; followerId: string } };
        }): Promise<FollowingEntity> => {
          const dto = MockDataStorage.items().find(
            item =>
              item.userId === data.where.userId_followerId.userId &&
              item.followerId === data.where.userId_followerId.followerId,
          );

          if (!dto) {
            throw new PrismaClientKnownRequestError(
              'Following with this userId and followerId does not exist!',
              {
                code: 'P2001',
                clientVersion: '',
              },
            );
          }

          MockDataStorage.setItems(
            MockDataStorage.items().filter(
              item =>
                item.userId !== data.where.userId_followerId.userId ||
                item.followerId !== data.where.userId_followerId.followerId,
            ),
          );

          return Promise.resolve(dto);
        },
      ),
  },
};
