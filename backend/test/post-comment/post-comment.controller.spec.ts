import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostCommentService } from './post-comment.mock';
import { mockPostCommentAttachmentService } from '../post-comment-attachment/post-comment-attachment.mock';
import { PostCommentController } from 'src/post-comment/post-comment.controller';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import { PostCommentAttachmentService } from 'src/post-comment-attachment/post-comment-attachment.service';

describe('PostCommentController', () => {
  let controller: PostCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCommentController],
      providers: [
        {
          provide: PostCommentService,
          useValue: mockPostCommentService,
        },
        {
          provide: PostCommentAttachmentService,
          useValue: mockPostCommentAttachmentService,
        },
      ],
    }).compile();

    controller = module.get<PostCommentController>(PostCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find post comments list by post id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentService.findById).toHaveBeenCalled();
  });

  it('should not find post comment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(() => controller.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentService.findById).toHaveBeenCalled();
  });

  it('should update a list of existing post comments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostCommentDtoList) {
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
    expect(mockPostCommentService.update).toHaveBeenCalled();
  });

  it('should not update a post comment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() =>
      controller.update({}, '', { ...MockDataStorage.updatePostCommentDtoList[0].data }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post comments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostCommentDtoList) {
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
        return !MockDataStorage.removePostCommentDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentService.remove).toHaveBeenCalled();
  });

  it('should not remove a post comment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentService.remove).toHaveBeenCalled();
  });
});
