import { Test, TestingModule } from '@nestjs/testing';
import { UserRegistrationMethodController } from 'src/user-registration-method/user-registration-method.controller';
import { UserRegistrationMethodService } from 'src/user-registration-method/user-registration-method.service';
import {
  MockDataStorage,
  mockUserRegistrationMethodService,
} from './user-registration-method.mock';

describe('UserRegistrationMethodController', () => {
  let controller: UserRegistrationMethodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRegistrationMethodController],
      providers: [
        {
          provide: UserRegistrationMethodService,
          useValue: mockUserRegistrationMethodService,
        },
      ],
    }).compile();

    controller = module.get<UserRegistrationMethodController>(UserRegistrationMethodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new user registration methods', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createUserRegistrationMethodDtoList) {
      expect(await controller.create(item)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual([
      ...initialItems,
      ...MockDataStorage.createUserRegistrationMethodDtoList,
    ]);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodService.create).toHaveBeenCalled();
  });

  it('should not create a new user registration method because it already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.create(MockDataStorage.items()[0])).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodService.create).toHaveBeenCalled();
  });

  it('should find all existing user registration methods', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodService.findAll).toHaveBeenCalled();
  });

  it('should find users list by user registration method for all existing user registration methods', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findUsersWithRegistrationMethod(item.name)).toEqual(item.users);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodService.findRegisteredUsersByMethodName).toHaveBeenCalled();
  });

  it('should not find users list by user registration method with provided name because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    expect(() => controller.findUsersWithRegistrationMethod('')).toThrow();

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodService.findRegisteredUsersByMethodName).toHaveBeenCalled();
  });

  it('should update a list of existing user registration methods by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateUserRegistrationMethodDtoList) {
      expect(await controller.update(item.name, item.data)).toEqual(item.data);
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
    expect(mockUserRegistrationMethodService.update).toHaveBeenCalled();
  });

  it('should not update a user registration method by provided name because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.update('', { name: '' })).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing user registration methods by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeUserRegistrationMethodDtoList) {
      expect(await controller.remove(item.name)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeUserRegistrationMethodDtoList.find(x => x.name === item.name);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodService.remove).toHaveBeenCalled();
  });

  it('should not remove a user registration method by provided name because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.remove('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRegistrationMethodService.remove).toHaveBeenCalled();
  });
});
