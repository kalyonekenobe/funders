import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockCategoriesOnPostsService } from './categories-on-posts.mock';
import { CategoriesOnPostsService } from 'src/categories-on-posts/categories-on-posts.service';
import { CategoriesOnPostsController } from 'src/categories-on-posts/categories-on-posts.controller';

describe('CategoriesOnPostsController', () => {
  let controller: CategoriesOnPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesOnPostsController],
      providers: [
        {
          provide: CategoriesOnPostsService,
          useValue: mockCategoriesOnPostsService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesOnPostsController>(CategoriesOnPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of categories for specified post', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createCategoriesOnPostsDtoList) {
      expect(await controller.createPostCategories(item.postId, item.data)).toEqual(
        item.data.map(x => ({ name: x.name })),
      );

      item.data.forEach(x => initialItems.push({ postId: item.postId, category: x.name }));
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsService.createPostCategories).toHaveBeenCalled();
  });

  it('should not create a list of categories for specified post some category already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() =>
      controller.createPostCategories(MockDataStorage.items()[0].postId, [
        { name: MockDataStorage.items()[0].category },
      ]),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsService.createPostCategories).toHaveBeenCalled();
  });

  it('should find all categories of specified post', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAllPostCategories(MockDataStorage.items()[0].postId)).toEqual(
      MockDataStorage.items()
        .filter(item => item.postId === MockDataStorage.items()[0].postId)
        .map(item => ({ name: item.category })),
    );

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsService.findAllPostCategories).toHaveBeenCalled();
  });

  it('should update a list of categories for specified post', async () => {
    MockDataStorage.setDefaultItems();

    let initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateCategoriesOnPostsDtoList) {
      expect(await controller.updatePostCategories(item.postId, item.data)).toEqual(
        item.data.map(x => ({ name: x.name })),
      );

      initialItems = initialItems.filter(x => x.postId !== item.postId);
      item.data.forEach(x => initialItems.push({ postId: item.postId, category: x.name }));
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsService.updatePostCategories).toHaveBeenCalled();
  });

  it('should remove a list of existing categories for specified post', async () => {
    MockDataStorage.setDefaultItems();

    let initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeCategoriesOnPostsDtoList) {
      expect(await controller.removePostCategories(item.postId, item.data)).toEqual(
        item.data.map(x => ({ name: x.name })),
      );

      initialItems = initialItems.filter(
        x =>
          !(x.postId === item.postId && item.data.find(category => category.name === x.category)),
      );
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsService.removePostCategories).toHaveBeenCalled();
  });

  it('should not remove existing categories for specified post because some category does not exist for this post', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.removePostCategories('', [{ name: '' }])).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockCategoriesOnPostsService.removePostCategories).toHaveBeenCalled();
  });
});
