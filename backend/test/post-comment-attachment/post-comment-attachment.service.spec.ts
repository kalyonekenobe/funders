import { Test, TestingModule } from '@nestjs/testing';
import {
  MockDataStorage,
  mockPostCommentAttachmentRepository,
} from './post-comment-attachment.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { PostCommentAttachmentService } from 'src/post-comment-attachment/post-comment-attachment.service';

describe('PostCommentAttachmentService', () => {
  let service: PostCommentAttachmentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostCommentAttachmentService,
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
          useValue: mockPostCommentAttachmentRepository,
        },
      ],
    }).compile();

    service = module.get<PostCommentAttachmentService>(PostCommentAttachmentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find post comment attachments list by post id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findAllForComment(item.commentId)).toEqual(
        MockDataStorage.items().filter(x => x.commentId === item.commentId),
      );
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentAttachmentRepository.postComment.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockPostCommentAttachmentRepository.postCommentAttachment.findMany).toHaveBeenCalled();
  });

  it('should set the list of post comment attachments for the post with specified id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(
      await service.setPostCommentAttachments(
        '4',
        MockDataStorage.createPostCommentAttachmentDtoList,
      ),
    ).toEqual([]);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentAttachmentRepository.postCommentAttachment.deleteMany).toHaveBeenCalled();
    expect(mockPostCommentAttachmentRepository.postCommentAttachment.createMany).toHaveBeenCalled();
    expect(mockPostCommentAttachmentRepository.postCommentAttachment.findMany).toHaveBeenCalled();
  });

  it('should find post comment attachments list by post comment attachment id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockPostCommentAttachmentRepository.postCommentAttachment.findUniqueOrThrow,
    ).toHaveBeenCalled();
  });

  it('should not find post comment attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(service.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockPostCommentAttachmentRepository.postCommentAttachment.findUniqueOrThrow,
    ).toHaveBeenCalled();
  });

  it('should update a list of existing post comment attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostCommentAttachmentDtoList) {
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
    expect(mockPostCommentAttachmentRepository.postCommentAttachment.update).toHaveBeenCalled();
  });

  it('should not update a post comment attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.update(
        '',
        { ...MockDataStorage.updatePostCommentAttachmentDtoList[0].data },
        {} as any,
      ),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentAttachmentRepository.postCommentAttachment.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post comment attachments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostCommentAttachmentDtoList) {
      const received = await service.remove(item.id);
      expect(received).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostCommentAttachmentDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentAttachmentRepository.postCommentAttachment.delete).toHaveBeenCalled();
  });

  it('should not remove a post comment attachment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentAttachmentRepository.postCommentAttachment.delete).toHaveBeenCalled();
  });
});
