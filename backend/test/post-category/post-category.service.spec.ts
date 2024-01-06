import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostCategoryRepository } from './post-category.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PostCategoryService } from 'src/post-category/post-category.service';

describe('Postcategorieservice', () => {
  let service: PostCategoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostCategoryService,
        {
          provide: PrismaService,
          useValue: mockPostCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<PostCategoryService>(PostCategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new post categories', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createPostCategoryDtoList) {
      expect(await service.create(item)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual([
      ...initialItems,
      ...MockDataStorage.createPostCategoryDtoList,
    ]);

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryRepository.postCategory.create).toHaveBeenCalled();
  });

  it('should not create a new post category because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.create(MockDataStorage.items()[0])).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryRepository.postCategory.create).toHaveBeenCalled();
  });

  it('should find all existing post categories', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryRepository.postCategory.findMany).toHaveBeenCalled();
  });

  it('should update a list of existing post categories by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updatePostCategoryDtoList) {
      expect(await service.update(item.name, item.data)).toEqual(item.data);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const dto = MockDataStorage.updatePostCategoryDtoList.find(x => x.name === item.name);

        return dto ? dto.data : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryRepository.postCategory.update).toHaveBeenCalled();
  });

  it('should not update a post category by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.update('', { name: '' })).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryRepository.postCategory.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post categories by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostCategoryDtoList) {
      expect(await service.remove(item.name)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostCategoryDtoList.find(x => x.name === item.name);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryRepository.postCategory.delete).toHaveBeenCalled();
  });

  it('should not remove a post category by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryRepository.postCategory.delete).toHaveBeenCalled();
  });
});
