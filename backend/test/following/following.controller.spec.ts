import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockFollowingService } from './following.mock';
import { FollowingService } from 'src/following/following.service';
import { FollowingController } from 'src/following/following.controller';

describe('FollowingController', () => {
  let controller: FollowingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowingController],
      providers: [
        {
          provide: FollowingService,
          useValue: mockFollowingService,
        },
      ],
    }).compile();

    controller = module.get<FollowingController>(FollowingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new followings', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createFollowingDtoList) {
      expect(await controller.create(item.userId, item.followerId)).toEqual(item);
      initialItems.push(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockFollowingService.create).toHaveBeenCalled();
  });

  it('should not create a new following because it already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() =>
      controller.create(MockDataStorage.items()[0].userId, MockDataStorage.items()[0].followerId),
    ).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockFollowingService.create).toHaveBeenCalled();
  });

  it('should find all existing user followings', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAllUserFollowings(MockDataStorage.items()[0].userId)).toEqual([
      MockDataStorage.items()[4],
    ]);

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockFollowingService.findAllUserFollowings).toHaveBeenCalled();
  });

  it('should find all existing user followers', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAllUserFollowers(MockDataStorage.items()[0].userId)).toEqual([
      MockDataStorage.items()[0],
    ]);

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockFollowingService.findAllUserFollowers).toHaveBeenCalled();
  });

  it('should remove a list of existing followings by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeFollowingDtoList) {
      expect(await controller.remove(item.userId, item.followerId)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeFollowingDtoList.find(
          x => x.userId === item.userId && x.followerId === item.followerId,
        );
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockFollowingService.remove).toHaveBeenCalled();
  });

  it('should not remove a following with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.remove('', '')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockFollowingService.remove).toHaveBeenCalled();
  });
});
