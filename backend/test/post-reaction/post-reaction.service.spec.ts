import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostReactionRepository } from './post-reaction.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostReactionService } from 'src/post-reaction/post-reaction.service';

describe('PostReactionService', () => {
  let service: PostReactionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostReactionService,
        {
          provide: PrismaService,
          useValue: mockPostReactionRepository,
        },
      ],
    }).compile();

    service = module.get<PostReactionService>(PostReactionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new post reactions', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createPostReactionDtoList) {
      const received = await service.create(item.postId, item.data);
      const expected = { ...received, ...item.data };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionRepository.postReaction.create).toHaveBeenCalled();
  });

  it('should not create a new post reaction because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.create(MockDataStorage.items()[0].postId, {
        userId: MockDataStorage.items()[0].userId,
        reactionType: MockDataStorage.items()[0].reactionType,
      }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionRepository.postReaction.create).toHaveBeenCalled();
  });

  it('should find all existing post reactions for specified post', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllForPost('73c67a90-149e-43d0-966c-91a9a7b3aba3')).toEqual(
      initialItems.filter(item => item.postId === '73c67a90-149e-43d0-966c-91a9a7b3aba3'),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionRepository.post.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockPostReactionRepository.postReaction.findMany).toHaveBeenCalled();
  });

  it('should find all existing post reactions for specified user', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllForUser('86362221-935b-4b15-a8cb-00be736f1795')).toEqual(
      initialItems.filter(item => item.postId === '86362221-935b-4b15-a8cb-00be736f1795'),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionRepository.user.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockPostReactionRepository.postReaction.findMany).toHaveBeenCalled();
  });

  it('should update a list of existing post reactions by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostReactionDtoList) {
      const received = await service.update(item.postId, item.userId, item.data);
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
    expect(mockPostReactionRepository.postReaction.update).toHaveBeenCalled();
  });

  it('should not update a post reaction with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.update('', '', { ...MockDataStorage.updatePostReactionDtoList[0].data }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionRepository.postReaction.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post reactions by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostReactionDtoList) {
      const received = await service.remove(item.postId, item.userId);
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
    expect(mockPostReactionRepository.postReaction.delete).toHaveBeenCalled();
  });

  it('should not remove a post reaction with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('', '')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostReactionRepository.postReaction.delete).toHaveBeenCalled();
  });
});
