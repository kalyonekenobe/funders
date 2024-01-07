import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockFollowingRepository } from './following.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { FollowingService } from 'src/following/following.service';

describe('FollowingService', () => {
  let service: FollowingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowingService,
        {
          provide: PrismaService,
          useValue: mockFollowingRepository,
        },
      ],
    }).compile();

    service = module.get<FollowingService>(FollowingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new followings', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createFollowingDtoList) {
      expect(await service.create({ ...item })).toEqual(item);
      initialItems.push(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockFollowingRepository.following.create).toHaveBeenCalled();
  });

  it('should not create a new following because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.create({ ...MockDataStorage.items()[0] })).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockFollowingRepository.following.create).toHaveBeenCalled();
  });

  it('should find all existing user followings', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllUserFollowings(MockDataStorage.items()[0].userId)).toEqual([
      MockDataStorage.items()[4],
    ]);

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockFollowingRepository.following.findMany).toHaveBeenCalled();
  });

  it('should find all existing user followers', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllUserFollowers(MockDataStorage.items()[0].userId)).toEqual([
      MockDataStorage.items()[0],
    ]);

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockFollowingRepository.following.findMany).toHaveBeenCalled();
  });

  it('should remove a list of existing followings by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeFollowingDtoList) {
      expect(await service.remove(item.userId, item.followerId)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeFollowingDtoList.find(
          x => x.userId === item.userId && x.followerId === item.followerId,
        );
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockFollowingRepository.following.delete).toHaveBeenCalled();
  });

  it('should not remove a following with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('', '')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockFollowingRepository.following.delete).toHaveBeenCalled();
  });
});
