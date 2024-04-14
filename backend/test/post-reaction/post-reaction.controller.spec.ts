import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostReactionService } from './post-reaction.mock';
import { PostReactionService } from 'src/post-reaction/post-reaction.service';
import { PostReactionController } from 'src/post-reaction/post-reaction.controller';

describe('PostReactionController', () => {
  let controller: PostReactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostReactionController],
      providers: [
        {
          provide: PostReactionService,
          useValue: mockPostReactionService,
        },
      ],
    }).compile();

    controller = module.get<PostReactionController>(PostReactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new post reactions', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createPostReactionDtoList) {
      const received = await controller.create(item.postId, item.data);
      const expected = { ...received, ...item.data };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionService.create).toHaveBeenCalled();
  });

  it('should not create a new post reaction because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() =>
      controller.create(MockDataStorage.items()[0].postId, {
        userId: MockDataStorage.items()[0].userId,
        reactionType: MockDataStorage.items()[0].reactionType,
      }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionService.create).toHaveBeenCalled();
  });

  it('should find all existing post reactions for specified post', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAllPostReactions('73c67a90-149e-43d0-966c-91a9a7b3aba3')).toEqual(
      initialItems.filter(item => item.postId === '73c67a90-149e-43d0-966c-91a9a7b3aba3'),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionService.findAllForPost).toHaveBeenCalled();
  });

  it('should update a list of existing post reactions by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostReactionDtoList) {
      const received = await controller.update(item.postId, item.userId, item.data);
      const expected = Object.assign(
        {},
        initialItems.find(x => x.postId === item.postId && x.userId === item.userId),
        item.data,
      );
      expect(received).toEqual(expected);
      updatedItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const updated = updatedItems.find(
          x => x.postId === item.postId && x.userId === item.userId,
        );

        return updated ? updated : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionService.update).toHaveBeenCalled();
  });

  it('should not update a post reaction with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() =>
      controller.update('', '', { ...MockDataStorage.updatePostReactionDtoList[0].data }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post reactions by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostReactionDtoList) {
      const received = await controller.remove(item.postId, item.userId);
      expect(received).toEqual({ ...item, datetime: received.datetime });
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostReactionDtoList.find(
          x => x.postId === item.postId && x.userId === item.userId,
        );
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionService.remove).toHaveBeenCalled();
  });

  it('should not remove a post reaction with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.remove('', '')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionService.remove).toHaveBeenCalled();
  });
});
