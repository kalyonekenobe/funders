import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostCommentAttachmentService } from './post-comment-attachment.mock';
import { PostCommentAttachmentController } from 'src/post-comment-attachment/post-comment-attachment.controller';
import { PostCommentAttachmentService } from 'src/post-comment-attachment/post-comment-attachment.service';

describe('PostCommentAttachmentController', () => {
  let controller: PostCommentAttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCommentAttachmentController],
      providers: [
        {
          provide: PostCommentAttachmentService,
          useValue: mockPostCommentAttachmentService,
        },
      ],
    }).compile();

    controller = module.get<PostCommentAttachmentController>(PostCommentAttachmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find post comment attachments list by post comment attachment id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentAttachmentService.findById).toHaveBeenCalled();
  });

  it('should not find post comment attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(() => controller.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentAttachmentService.findById).toHaveBeenCalled();
  });

  it('should update a list of existing post comment attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostCommentAttachmentDtoList) {
      const received = await controller.update(
        {
          file: item.data.file,
          resourceType: item.data.resourceType,
        } as any,
        item.id,
        item.data,
      );
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
    expect(mockPostCommentAttachmentService.update).toHaveBeenCalled();
  });

  it('should not update a post comment attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() =>
      controller.update({} as any, '', {
        ...MockDataStorage.updatePostCommentAttachmentDtoList[0].data,
      }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentAttachmentService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post comment attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostCommentAttachmentDtoList) {
      const received = await controller.remove(item.id);
      expect(received).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostCommentAttachmentDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentAttachmentService.remove).toHaveBeenCalled();
  });

  it('should not remove a post comment attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentAttachmentService.remove).toHaveBeenCalled();
  });
});
