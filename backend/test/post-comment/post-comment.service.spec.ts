import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostCommentRepository } from './post-comment.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostCommentService } from 'src/post-comment/post-comment.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';

describe('PostCommentService', () => {
  let service: PostCommentService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostCommentService,
        CloudinaryService,
        {
          provide: PrismaService,
          useValue: mockPostCommentRepository,
        },
      ],
    }).compile();

    service = module.get<PostCommentService>(PostCommentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new post comments', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createPostCommentDtoList) {
      const received = await service.create(item.postId, item.data, {});
      const expected = { ...received, ...item.data, postId: item.postId };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentRepository.postComment.create).toHaveBeenCalled();
  });

  it('should not create a new post comment because post with specified id was not found', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.create('', MockDataStorage.createPostCommentDtoList[0].data, {}),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentRepository.postComment.create).toHaveBeenCalled();
  });

  it('should find post comments list by post id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentRepository.postComment.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should not find post comment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(service.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentRepository.postComment.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should update a list of existing post comments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostCommentDtoList) {
      const received = await service.update(item.id, item.data, {});
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
    expect(mockPostCommentRepository.postComment.update).toHaveBeenCalled();
  });

  it('should not update a post comment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.update('', { ...MockDataStorage.updatePostCommentDtoList[0].data }, {}),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentRepository.postComment.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post comments by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostCommentDtoList) {
      const received = await service.remove(item.id);
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
    expect(mockPostCommentRepository.postComment.delete).toHaveBeenCalled();
  });

  it('should not remove a post comment with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCommentRepository.postComment.delete).toHaveBeenCalled();
  });
});
