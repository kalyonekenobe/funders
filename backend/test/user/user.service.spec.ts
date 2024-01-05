import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockUserRepository } from './user.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { PasswordModule } from 'src/core/password/password.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PasswordModule.forRoot(
          process.env.USER_PASSWORD_SALT_PREFIX ?? '',
          process.env.USER_PASSWORD_SALT_SUFFIX ?? '',
        ),
      ],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new users', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createUserDtoList) {
      const received = await service.create(item);
      const expected = { ...received, ...item };
      expect({ ...received, password: item.password }).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRepository.user.create).toHaveBeenCalled();
  });

  it('should not create a new user because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.create({
        ...MockDataStorage.items()[0],
        email: 'johndoe@gmail.com',
        password: '123',
      } as CreateUserDto),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRepository.user.create).toHaveBeenCalled();
  });

  it('should find all existing users', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRepository.user.findMany).toHaveBeenCalled();
  });

  it('should find users list by user id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRepository.user.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should not find user with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(service.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRepository.user.findUniqueOrThrow).toHaveBeenCalled();
  });

  it('should update a list of existing users by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updateUserDtoList) {
      const received = await service.update(item.id, item.data);
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
    expect(mockUserRepository.user.update).toHaveBeenCalled();
  });

  it('should not update a user with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.update('', { ...MockDataStorage.updateUserDtoList[0].data }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRepository.user.update).toHaveBeenCalled();
  });

  it('should remove a list of existing users by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeUserDtoList) {
      expect(await service.remove(item.id)).toEqual({
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
    expect(mockUserRepository.user.delete).toHaveBeenCalled();
  });

  it('should not remove a user with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUserRepository.user.delete).toHaveBeenCalled();
  });
});
