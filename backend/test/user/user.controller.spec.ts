import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockUserService } from './user.mock';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new users', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createUserDtoList) {
      const received = await controller.create(item);
      const expected = { ...received, ...item };
      expect({ ...received, password: item.password }).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserService.create).toHaveBeenCalled();
  });

  it('should not create a new user because it already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() =>
      controller.create({
        ...MockDataStorage.items()[0],
        email: 'johndoe@gmail.com',
        password: '123',
      } as CreateUserDto),
    ).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserService.create).toHaveBeenCalled();
  });

  it('should find all existing users', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserService.findAll).toHaveBeenCalled();
  });

  it('should find users list by user id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserService.findById).toHaveBeenCalled();
  });

  it('should not find user with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    expect(() => controller.findById('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserService.findById).toHaveBeenCalled();
  });

  it('should update a list of existing users by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updateUserDtoList) {
      const received = await controller.update(item.id, item.data);
      const expected = Object.assign(
        {},
        initialItems.find(x => x.id === item.id),
        item.data,
      );
      expect({ ...received, password: expected.password }).toEqual(expected);
      updatedItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const updated = updatedItems.find(x => x.id === item.id);

        return updated ? updated : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUserService.update).toHaveBeenCalled();
  });

  it('should not update a user with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.update('', { ...MockDataStorage.updateUserDtoList[0].data })).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing users by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeUserDtoList) {
      expect(await controller.remove(item.id)).toEqual({
        ...item,
        registeredAt: expect.any(Date),
      });
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeUserDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUserService.remove).toHaveBeenCalled();
  });

  it('should not remove a user with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.remove('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserService.remove).toHaveBeenCalled();
  });
});
