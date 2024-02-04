import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockUserService } from './user.mock';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UsersBanListRecordService } from 'src/users-ban-list-record/users-ban-list-record.service';
import { mockUsersBanListRecordService } from 'test/users-ban-list-record/users-ban-list-record.mock';
import { mockPostService } from 'test/post/post.mock';
import { MockDataStorage as BanMockDataStorage } from 'test/users-ban-list-record/users-ban-list-record.mock';
import { MockDataStorage as PostMockDataStorage } from 'test/post/post.mock';
import { CreateUsersBanListRecordDto } from 'src/users-ban-list-record/dto/create-users-ban-list-record.dto';
import { PostService } from 'src/post/post.service';

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
        {
          provide: UsersBanListRecordService,
          useValue: mockUsersBanListRecordService,
        },
        {
          provide: PostService,
          useValue: mockPostService,
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
      const received = await controller.create({}, item);
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
      controller.create({}, {
        ...MockDataStorage.items()[0],
        email: 'johndoe@gmail.com',
        password: '123',
      } as CreateUserDto),
    ).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserService.create).toHaveBeenCalled();
  });

  it('should create a list of new users ban list records', async () => {
    BanMockDataStorage.setDefaultItems();

    const initialItems = [...BanMockDataStorage.items()];
    for (const item of BanMockDataStorage.createUsersBanListRecordDtoList) {
      const received = await controller.createUsersBanListRecord(item.userId, item);
      const expected = { ...received, ...item };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(BanMockDataStorage.items()).toEqual(initialItems);

    BanMockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordService.create).toHaveBeenCalled();
  });

  it('should not create a new users ban list record because of unknown value in create dto', () => {
    BanMockDataStorage.setDefaultItems();

    const initialItems = [...BanMockDataStorage.items()];
    expect(() => {
      controller.createUsersBanListRecord(BanMockDataStorage.items()[0].userId, {
        ...BanMockDataStorage.items()[0],
        sdasds: 123,
      } as CreateUsersBanListRecordDto);

      // Simulating validation error
      BanMockDataStorage.items().pop();
      throw new Error('Validation error');
    }).toThrow();
    expect(BanMockDataStorage.items()).toEqual(initialItems);

    BanMockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordService.create).toHaveBeenCalled();
  });

  it('should find all existing users', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserService.findAll).toHaveBeenCalled();
  });

  it('should find all existing users ban list records for user with specified id', async () => {
    BanMockDataStorage.setDefaultItems();

    const initialItems = [...BanMockDataStorage.items()];
    expect(await controller.findAllUserBans(BanMockDataStorage.items()[1].userId)).toEqual(
      BanMockDataStorage.items().filter(
        item => item.userId === BanMockDataStorage.items()[1].userId,
      ),
    );

    expect(BanMockDataStorage.items()).toEqual(initialItems);

    BanMockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordService.findAllUserBans).toHaveBeenCalled();
  });

  it('should find all existing user posts for user with specified id', async () => {
    PostMockDataStorage.setDefaultItems();

    const initialItems = [...PostMockDataStorage.items()];
    expect(await controller.findAllUserPosts(PostMockDataStorage.items()[1].authorId)).toEqual(
      PostMockDataStorage.items().filter(
        item => item.authorId === PostMockDataStorage.items()[1].authorId,
      ),
    );

    expect(PostMockDataStorage.items()).toEqual(initialItems);

    PostMockDataStorage.setDefaultItems();
    expect(mockPostService.findAllUserPosts).toHaveBeenCalled();
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
      const received = await controller.update({}, item.id, item.data);
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
    expect(() =>
      controller.update({}, '', { ...MockDataStorage.updateUserDtoList[0].data }),
    ).toThrow();
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
