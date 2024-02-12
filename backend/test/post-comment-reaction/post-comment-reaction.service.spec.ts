import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostCommentReactionRepository } from './post-comment-reaction.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostCommentReactionService } from 'src/post-comment-reaction/post-comment-reaction.service';

describe('PostCommentReactionService', () => {
  let service: PostCommentReactionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostCommentReactionService,
        {
          provide: PrismaService,
          useValue: mockPostCommentReactionRepository,
        },
      ],
    }).compile();

    service = module.get<PostCommentReactionService>(PostCommentReactionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new post comment reactions', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createPostCommentReactionDtoList) {
      const received = await service.create(item.commentId, item.data);
      const expected = { ...received, ...item.data };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionRepository.postCommentReaction.create).toHaveBeenCalled();
  });

  it('should not create a new post comment reaction because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.create(MockDataStorage.items()[0].commentId, {
        userId: MockDataStorage.items()[0].userId,
        reactionType: MockDataStorage.items()[0].reactionType,
      }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionRepository.postCommentReaction.create).toHaveBeenCalled();
  });

  it('should find all existing post comment reactions for specified post comment', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllForComment('73c67a90-149e-43d0-966c-91a9a7b3aba3')).toEqual(
      initialItems.filter(item => item.commentId === '73c67a90-149e-43d0-966c-91a9a7b3aba3'),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionRepository.postComment.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockPostCommentReactionRepository.postCommentReaction.findMany).toHaveBeenCalled();
  });

  it('should find all existing post comment reactions for specified user', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllForUser('86362221-935b-4b15-a8cb-00be736f1795')).toEqual(
      initialItems.filter(item => item.commentId === '86362221-935b-4b15-a8cb-00be736f1795'),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionRepository.user.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockPostCommentReactionRepository.postCommentReaction.findMany).toHaveBeenCalled();
  });

  it('should update a list of existing post comment reactions by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostCommentReactionDtoList) {
      const received = await service.update(item.commentId, item.userId, item.data);
      const expected = Object.assign(
        {},
        initialItems.find(x => x.commentId === item.commentId && x.userId === item.userId),
        item.data,
      );
      expect(received).toEqual(expected);
      updatedItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const updated = updatedItems.find(
          x => x.commentId === item.commentId && x.userId === item.userId,
        );

        return updated ? updated : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionRepository.postCommentReaction.update).toHaveBeenCalled();
  });

  it('should not update a post comment reaction with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.update('', '', { ...MockDataStorage.updatePostCommentReactionDtoList[0].data }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionRepository.postCommentReaction.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post comment reactions by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostCommentReactionDtoList) {
      const received = await service.remove(item.commentId, item.userId);
      expect(received).toEqual({ ...item, datetime: received.datetime });
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostCommentReactionDtoList.find(
          x => x.commentId === item.commentId && x.userId === item.userId,
        );
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionRepository.postCommentReaction.delete).toHaveBeenCalled();
  });

  it('should not remove a post comment reaction with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('', '')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionRepository.postCommentReaction.delete).toHaveBeenCalled();
  });
});
