import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostCommentReactionService } from './post-comment-reaction.mock';
import { PostCommentReactionController } from 'src/post-comment-reaction/post-comment-reaction.controller';
import { PostCommentReactionService } from 'src/post-comment-reaction/post-comment-reaction.service';

describe('PostCommentReactionController', () => {
  let controller: PostCommentReactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCommentReactionController],
      providers: [
        {
          provide: PostCommentReactionService,
          useValue: mockPostCommentReactionService,
        },
      ],
    }).compile();

    controller = module.get<PostCommentReactionController>(PostCommentReactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new post comment reactions', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createPostCommentReactionDtoList) {
      const received = await controller.create(item.commentId, item.data);
      const expected = { ...received, ...item.data };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionService.create).toHaveBeenCalled();
  });

  it('should not create a new post comment reaction because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() =>
      controller.create(MockDataStorage.items()[0].commentId, {
        userId: MockDataStorage.items()[0].userId,
        reactionType: MockDataStorage.items()[0].reactionType,
      }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionService.create).toHaveBeenCalled();
  });

  it('should find all existing post comment reactions for specified post comment', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(
      await controller.findAllPostCommentReactions('73c67a90-149e-43d0-966c-91a9a7b3aba3'),
    ).toEqual(
      initialItems.filter(item => item.commentId === '73c67a90-149e-43d0-966c-91a9a7b3aba3'),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionService.findAllForComment).toHaveBeenCalled();
  });

  it('should update a list of existing post comment reactions by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostCommentReactionDtoList) {
      const received = await controller.update(item.commentId, item.userId, item.data);
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
    expect(mockPostCommentReactionService.update).toHaveBeenCalled();
  });

  it('should not update a post comment reaction with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() =>
      controller.update('', '', { ...MockDataStorage.updatePostCommentReactionDtoList[0].data }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post comment reactions by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostCommentReactionDtoList) {
      const received = await controller.remove(item.commentId, item.userId);
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
    expect(mockPostCommentReactionService.remove).toHaveBeenCalled();
  });

  it('should not remove a post comment reaction with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.remove('', '')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentReactionService.remove).toHaveBeenCalled();
  });
});
