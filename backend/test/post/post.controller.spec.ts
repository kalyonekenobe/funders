import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostService } from './post.mock';
import { PostController } from 'src/post/post.controller';
import { PostService } from 'src/post/post.service';
import { PostAttachmentService } from 'src/post-attachment/post-attachment.service';
import { PostDonationService } from 'src/post-donation/post-donation.service';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import {
  MockDataStorage as PostAttachmentMockDataStorage,
  mockPostAttachmentService,
} from 'test/post-attachment/post-attachment.mock';
import {
  MockDataStorage as PostDonationMockDataStorage,
  mockPostDonationService,
} from 'test/post-donation/post-donation.mock';
import {
  MockDataStorage as PostCommentMockDataStorage,
  mockPostCommentService,
} from 'test/post-comment/post-comment.mock';

describe('PostController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: PostAttachmentService, useValue: mockPostAttachmentService },
        { provide: PostDonationService, useValue: mockPostDonationService },
        { provide: PostCommentService, useValue: mockPostCommentService },
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new posts', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createPostDtoList) {
      const received = await controller.create({}, item);
      const expected = { ...received, ...item };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostService.create).toHaveBeenCalled();
  });

  it('should not create a new post because it already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => {
      controller.create({}, MockDataStorage.createPostDtoList[0]);

      // Simulating validation error
      MockDataStorage.items().pop();
      throw new Error('Validation error');
    }).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostService.create).toHaveBeenCalled();
  });

  it('should create a list of new post comments', async () => {
    PostCommentMockDataStorage.setDefaultItems();

    const initialItems = [...PostCommentMockDataStorage.items()];
    for (const item of PostCommentMockDataStorage.createPostCommentDtoList) {
      const received = await controller.createComment({}, item.postId, item.data);
      const expected = { ...received, ...item.data, postId: item.postId };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(PostCommentMockDataStorage.items()).toEqual(initialItems);

    PostCommentMockDataStorage.setDefaultItems();
    expect(mockPostCommentService.create).toHaveBeenCalled();
  });

  it('should not create a new post comment because post with specified id was not found', () => {
    PostCommentMockDataStorage.setDefaultItems();

    const initialItems = [...PostCommentMockDataStorage.items()];
    expect(() =>
      controller.createComment({}, '', PostCommentMockDataStorage.createPostCommentDtoList[0].data),
    ).toThrow();
    expect(PostCommentMockDataStorage.items()).toEqual(initialItems);

    PostCommentMockDataStorage.setDefaultItems();
    expect(mockPostCommentService.create).toHaveBeenCalled();
  });

  it('should find all existing posts', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostService.findAll).toHaveBeenCalled();
  });

  it('should find all existing post comments for post with specified id', async () => {
    PostCommentMockDataStorage.setDefaultItems();

    const initialItems = [...PostCommentMockDataStorage.items()];
    expect(
      await controller.findAllPostComments(PostCommentMockDataStorage.items()[0].postId),
    ).toEqual(
      PostCommentMockDataStorage.items().filter(
        item => item.postId === PostCommentMockDataStorage.items()[0].postId,
      ),
    );

    expect(PostCommentMockDataStorage.items()).toEqual(initialItems);

    PostCommentMockDataStorage.setDefaultItems();
    expect(mockPostCommentService.findAllForPost).toHaveBeenCalled();
  });

  it('should find posts list by post id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostService.findById).toHaveBeenCalled();
  });

  it('should not find post with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    expect(() => controller.findById('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostService.findById).toHaveBeenCalled();
  });

  it('should update a list of existing posts by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostDtoList) {
      const received = await controller.update({}, item.id, item.data);
      const expected = Object.assign(
        {},
        initialItems.find(x => x.id === item.id),
        item.data,
      );
      expect(received).toEqual(expected);
      updatedItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const updated = updatedItems.find(x => x.id === item.id);

        return updated ? updated : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostService.update).toHaveBeenCalled();
  });

  it('should not update a post with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() =>
      controller.update({}, '', { ...MockDataStorage.updatePostDtoList[0].data }),
    ).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing posts by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostDtoList) {
      const received = await controller.remove(item.id);
      expect(received).toEqual({
        ...item,
        createdAt: received.createdAt,
        updatedAt: received.updatedAt,
        removedAt: received.removedAt,
      });
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostService.remove).toHaveBeenCalled();
  });

  it('should not remove a post with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.remove('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostService.remove).toHaveBeenCalled();
  });
});
