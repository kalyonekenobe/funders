import { Test, TestingModule } from '@nestjs/testing';
import { UserRegistrationMethodService } from 'src/user-registration-method/user-registration-method.service';
import {
  MockDataStorage,
  mockUserRegistrationMethodRepository,
} from './user-registration-method.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';

describe('UserRegistrationMethodService', () => {
  let service: UserRegistrationMethodService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRegistrationMethodService,
        {
          provide: PrismaService,
          useValue: mockUserRegistrationMethodRepository,
        },
      ],
    }).compile();

    service = module.get<UserRegistrationMethodService>(UserRegistrationMethodService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new user registration methods', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createUserRegistrationMethodDtoList) {
      expect(await service.create(item)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual([
      ...initialItems,
      ...MockDataStorage.createUserRegistrationMethodDtoList,
    ]);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodRepository.userRegistrationMethod.create).toHaveBeenCalled();
  });

  it('should not create a new user registration method because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.create(MockDataStorage.items()[0])).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodRepository.userRegistrationMethod.create).toHaveBeenCalled();
  });

  it('should find all existing user registration methods', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodRepository.userRegistrationMethod.findMany).toHaveBeenCalled();
  });

  it('should find users list by user registration method for all existing user registration methods', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findRegisteredUsersByMethodName(item.name)).toEqual(item.users);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockUserRegistrationMethodRepository.userRegistrationMethod.findUniqueOrThrow,
    ).toHaveBeenCalled();
  });

  it('should not find users list by user registration method with provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(service.findRegisteredUsersByMethodName('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockUserRegistrationMethodRepository.userRegistrationMethod.findUniqueOrThrow,
    ).toHaveBeenCalled();
  });

  it('should update a list of existing user registration methods by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateUserRegistrationMethodDtoList) {
      expect(await service.update(item.name, item.data)).toEqual(item.data);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const dto = MockDataStorage.updateUserRegistrationMethodDtoList.find(
          x => x.name === item.name,
        );

        return dto ? dto.data : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodRepository.userRegistrationMethod.update).toHaveBeenCalled();
  });

  it('should not update a user registration method by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.update('', { name: '' })).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodRepository.userRegistrationMethod.update).toHaveBeenCalled();
  });

  it('should remove a list of existing user registration methods by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeUserRegistrationMethodDtoList) {
      expect(await service.remove(item.name)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeUserRegistrationMethodDtoList.find(x => x.name === item.name);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodRepository.userRegistrationMethod.delete).toHaveBeenCalled();
  });

  it('should not remove a user registration method by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodRepository.userRegistrationMethod.delete).toHaveBeenCalled();
  });
});
