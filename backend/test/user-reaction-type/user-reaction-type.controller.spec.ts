import { Test, TestingModule } from '@nestjs/testing';
import { UserReactionTypeController } from 'src/user-reaction-type/user-reaction-type.controller';
import { MockDataStorage, mockUserReactionTypeService } from './user-reaction-type.mock';
import { UserReactionTypeService } from 'src/user-reaction-type/user-reaction-type.service';

describe('UserReactionTypeController', () => {
  let controller: UserReactionTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserReactionTypeController],
      providers: [
        {
          provide: UserReactionTypeService,
          useValue: mockUserReactionTypeService,
        },
      ],
    }).compile();

    controller = module.get<UserReactionTypeController>(UserReactionTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new user reaction types', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createUserRactionTypeDtoList) {
      expect(await controller.create(item)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual([
      ...initialItems,
      ...MockDataStorage.createUserRactionTypeDtoList,
    ]);

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeService.create).toHaveBeenCalled();
  });

  it('should not create a new user reaction type because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.create(MockDataStorage.items()[0])).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeService.create).toHaveBeenCalled();
  });

  it('should find all existing user reaction types', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeService.findAll).toHaveBeenCalled();
  });

  it('should update a list of existing user reaction types by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateUserReactionTypeDtoList) {
      expect(await controller.update(item.name, item.data)).toEqual(item.data);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const dto = MockDataStorage.updateUserReactionTypeDtoList.find(x => x.name === item.name);

        return dto ? dto.data : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeService.update).toHaveBeenCalled();
  });

  it('should not update a user reaction type by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.update('', { name: '' })).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing user reaction types by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeUserReactionTypeDtoList) {
      expect(await controller.remove(item.name)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeUserReactionTypeDtoList.find(x => x.name === item.name);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeService.remove).toHaveBeenCalled();
  });

  it('should not remove a user reaction type by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(() => controller.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeService.remove).toHaveBeenCalled();
  });
});
