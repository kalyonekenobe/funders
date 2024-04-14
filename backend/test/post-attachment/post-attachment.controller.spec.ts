import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostAttachmentService } from './post-attachment.mock';
import { PostAttachmentController } from 'src/post-attachment/post-attachment.controller';
import { PostAttachmentService } from 'src/post-attachment/post-attachment.service';

describe('PostAttachmentController', () => {
  let controller: PostAttachmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostAttachmentController],
      providers: [
        {
          provide: PostAttachmentService,
          useValue: mockPostAttachmentService,
        },
      ],
    }).compile();

    controller = module.get<PostAttachmentController>(PostAttachmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find post attachments list by post attachment id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentService.findById).toHaveBeenCalled();
  });

  it('should not find post attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(() => controller.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentService.findById).toHaveBeenCalled();
  });

  it('should update a list of existing post attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostAttachmentDtoList) {
      const received = await controller.update({ file: [] }, item.id, item.data);
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
    expect(mockPostAttachmentService.update).toHaveBeenCalled();
  });

  it('should not update a post attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() =>
      controller.update({ file: [] }, '', {
        ...MockDataStorage.updatePostAttachmentDtoList[0].data,
      }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostAttachmentDtoList) {
      const received = await controller.remove(item.id);
      expect(received).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostAttachmentDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentService.remove).toHaveBeenCalled();
  });

  it('should not remove a post attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentService.remove).toHaveBeenCalled();
  });
});
