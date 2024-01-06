import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockUserReactionTypeRepository } from './user-reaction-type.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserReactionTypeService } from 'src/user-reaction-type/user-reaction-type-service';

describe('UserReactionTypeService', () => {
  let service: UserReactionTypeService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserReactionTypeService,
        {
          provide: PrismaService,
          useValue: mockUserReactionTypeRepository,
        },
      ],
    }).compile();

    service = module.get<UserReactionTypeService>(UserReactionTypeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new user reaction types', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createUserRactionTypeDtoList) {
      expect(await service.create(item)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual([
      ...initialItems,
      ...MockDataStorage.createUserRactionTypeDtoList,
    ]);

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeRepository.userReactionType.create).toHaveBeenCalled();
  });

  it('should not create a new user reaction type because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.create(MockDataStorage.items()[0])).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeRepository.userReactionType.create).toHaveBeenCalled();
  });

  it('should find all existing user reaction types', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeRepository.userReactionType.findMany).toHaveBeenCalled();
  });

  it('should update a list of existing user reaction types by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateUserReactionTypeDtoList) {
      expect(await service.update(item.name, item.data)).toEqual(item.data);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const dto = MockDataStorage.updateUserReactionTypeDtoList.find(x => x.name === item.name);

        return dto ? dto.data : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeRepository.userReactionType.update).toHaveBeenCalled();
  });

  it('should not update a user reaction type by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.update('', { name: '' })).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeRepository.userReactionType.update).toHaveBeenCalled();
  });

  it('should remove a list of existing user reaction types by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeUserReactionTypeDtoList) {
      expect(await service.remove(item.name)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeUserReactionTypeDtoList.find(x => x.name === item.name);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeRepository.userReactionType.delete).toHaveBeenCalled();
  });

  it('should not remove a user reaction type by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserReactionTypeRepository.userReactionType.delete).toHaveBeenCalled();
  });
});
