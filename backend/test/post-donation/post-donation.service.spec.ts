import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostDonationRepository } from './post-donation.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostDonationService } from 'src/post-donation/post-donation.service';

describe('PostDonationService', () => {
  let service: PostDonationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostDonationService,
        {
          provide: PrismaService,
          useValue: mockPostDonationRepository,
        },
      ],
    }).compile();

    service = module.get<PostDonationService>(PostDonationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new post donations', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createPostDonationDtoList) {
      const received = await service.create(item.postId, item.data);
      const expected = { ...received, ...item.data };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationRepository.postDonation.create).toHaveBeenCalled();
  });

  it('should not create a new post donation because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      new Promise(() => {
        service.create(
          MockDataStorage.createPostDonationDtoList[0].postId,
          MockDataStorage.createPostDonationDtoList[0].data,
        );

        // Simulating validation error
        throw new Error('Validation error');
      }),
    ).rejects.toThrow();
    MockDataStorage.items().pop();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationRepository.postDonation.create).toHaveBeenCalled();
  });

  it('should find all existing post donations for specified post', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllForPost('86362221-935b-4b15-a8cb-00be736f1795')).toEqual(
      initialItems.filter(item => item.postId === '86362221-935b-4b15-a8cb-00be736f1795'),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationRepository.post.findUniqueOrThrow).toHaveBeenCalled();
    expect(mockPostDonationRepository.postDonation.findMany).toHaveBeenCalled();
  });

  it('should find post donations list by post donation id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationRepository.postDonation.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should not find post donation with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(service.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationRepository.postDonation.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should update a list of existing post donations by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostDonationDtoList) {
      const received = await service.update(item.id, item.data);
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
    expect(mockPostDonationRepository.postDonation.update).toHaveBeenCalled();
  });

  it('should not update a post donation with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.update('', { ...MockDataStorage.updatePostDonationDtoList[0].data }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationRepository.postDonation.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post donations by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostDonationDtoList) {
      const received = await service.remove(item.id);
      expect(received).toEqual({ ...item, datetime: received.datetime });
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostDonationDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationRepository.postDonation.delete).toHaveBeenCalled();
  });

  it('should not remove a post donation with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationRepository.postDonation.delete).toHaveBeenCalled();
  });
});
