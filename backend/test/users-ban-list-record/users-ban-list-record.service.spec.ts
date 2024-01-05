import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockUsersBanListRecordRepository } from './users-ban-list-record.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UsersBanListRecordService } from 'src/users-ban-list-record/users-ban-list-record.service';
import { PasswordModule } from 'src/core/password/password.module';
import { CreateUsersBanListRecordDto } from 'src/users-ban-list-record/dto/create-users-ban-list-record.dto';

describe('UsersBanListRecordService', () => {
  let service: UsersBanListRecordService;
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
        UsersBanListRecordService,
        {
          provide: PrismaService,
          useValue: mockUsersBanListRecordRepository,
        },
      ],
    }).compile();

    service = module.get<UsersBanListRecordService>(UsersBanListRecordService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new users ban list records', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createUsersBanListRecordDtoList) {
      const received = await service.create(item);
      const expected = { ...received, ...item };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordRepository.usersBanListRecord.create).toHaveBeenCalled();
  });

  it('should not create a new users ban list record because of unknown value in create dto', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      new Promise(() => {
        service.create({
          ...MockDataStorage.items()[0],
          sdasds: 123,
        } as CreateUsersBanListRecordDto);

        // Simulating validation error
        MockDataStorage.items().pop();
        throw new Error('Validation error');
      }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordRepository.usersBanListRecord.create).toHaveBeenCalled();
  });

  it('should find all existing users ban list records', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordRepository.usersBanListRecord.findMany).toHaveBeenCalled();
  });

  it('should find users ban list records list by users ban list record id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordRepository.usersBanListRecord.findUniqueOrThrow,
    ).toHaveBeenCalled();
  });

  it('should not find users ban list record with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(service.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordRepository.usersBanListRecord.findUniqueOrThrow,
    ).toHaveBeenCalled();
  });

  it('should update a list of existing users ban list records by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updateUsersBanListRecordDtoList) {
      const received = await service.update(item.id, item.data);
      const expected = Object.assign(
        {},
        initialItems.find(x => x.id === item.id),
        item.data,
      );
      expect(received).toEqual(expected);
      updatedItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const updated = updatedItems.find(x => x.id === item.id);

        return updated ? updated : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordRepository.usersBanListRecord.update).toHaveBeenCalled();
  });

  it('should not update a users ban list record with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(
      service.update('', { ...MockDataStorage.updateUsersBanListRecordDtoList[0].data }),
    ).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordRepository.usersBanListRecord.update).toHaveBeenCalled();
  });

  it('should remove a list of existing users ban list records by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeUsersBanListRecordDtoList) {
      expect(await service.remove(item.id)).toEqual({
        ...item,
        bannedAt: expect.any(Date),
      });
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeUsersBanListRecordDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordRepository.usersBanListRecord.delete).toHaveBeenCalled();
  });

  it('should not remove a users ban list record with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordRepository.usersBanListRecord.delete).toHaveBeenCalled();
  });
});
