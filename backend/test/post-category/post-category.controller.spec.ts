import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostCategoryService } from './post-category.mock';
import { PostCategoryController } from 'src/post-category/post-category.controller';
import { PostCategoryService } from 'src/post-category/post-category.service';

describe('PostCategoryController', () => {
  let controller: PostCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostCategoryController],
      providers: [
        {
          provide: PostCategoryService,
          useValue: mockPostCategoryService,
        },
      ],
    }).compile();

    controller = module.get<PostCategoryController>(PostCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new post categories', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createPostCategoryDtoList) {
      expect(await controller.create(item)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual([
      ...initialItems,
      ...MockDataStorage.createPostCategoryDtoList,
    ]);

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryService.create).toHaveBeenCalled();
  });

  it('should not create a new post category because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.create(MockDataStorage.items()[0])).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryService.create).toHaveBeenCalled();
  });

  it('should find all existing post categories', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryService.findAll).toHaveBeenCalled();
  });

  it('should update a list of existing post categories by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updatePostCategoryDtoList) {
      expect(await controller.update(item.name, item.data)).toEqual(item.data);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const dto = MockDataStorage.updatePostCategoryDtoList.find(x => x.name === item.name);

        return dto ? dto.data : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryService.update).toHaveBeenCalled();
  });

  it('should not update a post category by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.update('', { name: '' })).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post categories by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostCategoryDtoList) {
      expect(await controller.remove(item.name)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostCategoryDtoList.find(x => x.name === item.name);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryService.remove).toHaveBeenCalled();
  });

  it('should not remove a post category by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostCategoryService.remove).toHaveBeenCalled();
  });
});
