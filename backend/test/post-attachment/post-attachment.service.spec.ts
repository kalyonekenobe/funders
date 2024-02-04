import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostAttachmentRepository } from './post-attachment.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { PostAttachmentService } from 'src/post-attachment/post-attachment.service';

describe('PostAttachmentService', () => {
  let service: PostAttachmentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostAttachmentService,
        {
          provide: CloudinaryService,
          useValue: {
            prepareSingleResourceForUpload: file => ({
              resource: { publicId: file.file, resourceType: file.resourceType },
              upload: () => {},
            }),
            prepareSingleResourceForDelete: () => ({
              resource: { publicId: '', resourceType: '' },
              delete: () => {},
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: mockPostAttachmentRepository,
        },
      ],
    }).compile();

    service = module.get<PostAttachmentService>(PostAttachmentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find post attachments list by post id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findAllForPost(item.postId)).toEqual(
        MockDataStorage.items().filter(x => x.postId === item.postId),
      );
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentRepository.post.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockPostAttachmentRepository.postAttachment.findMany).toHaveBeenCalled();
  });

  it('should set the list of post attachments for the post with specified id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(
      await service.setPostAttachments('4', MockDataStorage.createPostAttachmentDtoList),
    ).toEqual([]);

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentRepository.postAttachment.deleteMany).toHaveBeenCalled();
    expect(mockPostAttachmentRepository.postAttachment.createMany).toHaveBeenCalled();
    expect(mockPostAttachmentRepository.postAttachment.findMany).toHaveBeenCalled();
  });

  it('should find post attachments list by post attachment id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentRepository.postAttachment.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should not find post attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(service.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentRepository.postAttachment.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should update a list of existing post attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostAttachmentDtoList) {
      const received = await service.update(item.id, item.data, {
        file: item.data.file,
        resourceType: item.data.resourceType,
      } as any);
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
    expect(mockPostAttachmentRepository.postAttachment.update).toHaveBeenCalled();
  });

  it('should not update a post attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.update('', { ...MockDataStorage.updatePostAttachmentDtoList[0].data }, {} as any),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentRepository.postAttachment.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostAttachmentDtoList) {
      const received = await service.remove(item.id);
      expect(received).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostAttachmentDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentRepository.postAttachment.delete).toHaveBeenCalled();
  });

  it('should not remove a post attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostAttachmentRepository.postAttachment.delete).toHaveBeenCalled();
  });
});
