import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockCategoriesOnPostsRepository } from './categories-on-posts.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CategoriesOnPostsService } from 'src/categories-on-posts/categories-on-posts.service';

describe('CategoriesOnPostsService', () => {
  let service: CategoriesOnPostsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesOnPostsService,
        {
          provide: PrismaService,
          useValue: mockCategoriesOnPostsRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesOnPostsService>(CategoriesOnPostsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of categories for specified post', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createCategoriesOnPostsDtoList) {
      expect(await service.createPostCategories(item.postId, item.data)).toEqual(
        item.data.map(x => ({ name: x.name })),
      );

      item.data.forEach(x => initialItems.push({ postId: item.postId, category: x.name }));
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsRepository.categoriesOnPosts.createMany).toHaveBeenCalled();
  });

  it('should not create a list of categories for specified post some category already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.createPostCategories(MockDataStorage.items()[0].postId, [
        { name: MockDataStorage.items()[0].category },
      ]),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsRepository.categoriesOnPosts.createMany).toHaveBeenCalled();
  });

  it('should find all categories of specified post', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAllPostCategories(MockDataStorage.items()[0].postId)).toEqual(
      MockDataStorage.items()
        .filter(item => item.postId === MockDataStorage.items()[0].postId)
        .map(item => ({ name: item.category })),
    );

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsRepository.categoriesOnPosts.findMany).toHaveBeenCalled();
  });

  it('should update a list of categories for specified post', async () => {
    MockDataStorage.setDefaultItems();

    let initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateCategoriesOnPostsDtoList) {
      expect(await service.updatePostCategories(item.postId, item.data)).toEqual(
        item.data.map(x => ({ name: x.name })),
      );

      initialItems = initialItems.filter(x => x.postId !== item.postId);
      item.data.forEach(x => initialItems.push({ postId: item.postId, category: x.name }));
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsRepository.categoriesOnPosts.createMany).toHaveBeenCalled();
    expect(mockCategoriesOnPostsRepository.categoriesOnPosts.deleteMany).toHaveBeenCalled();
  });

  it('should remove a list of existing categories for specified post', async () => {
    MockDataStorage.setDefaultItems();

    let initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeCategoriesOnPostsDtoList) {
      expect(await service.removePostCategories(item.postId, item.data)).toEqual(
        item.data.map(x => ({ name: x.name })),
      );

      initialItems = initialItems.filter(
        x =>
          !(x.postId === item.postId && item.data.find(category => category.name === x.category)),
      );
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsRepository.categoriesOnPosts.deleteMany).toHaveBeenCalled();
  });

  it('should not remove existing categories for specified post because some category does not exist for this post', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.removePostCategories('', [{ name: '' }])).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsRepository.categoriesOnPosts.deleteMany).toHaveBeenCalled();
  });
});
