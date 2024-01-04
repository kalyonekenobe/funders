import { Test, TestingModule } from '@nestjs/testing';
import { UsersBanListRecordStatusService } from 'src/users-ban-list-record-status/users-ban-list-record-status.service';
import {
  MockDataStorage,
  mockUsersBanListRecordStatusRepository,
} from './users-ban-list-record-status.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';

describe('UsersBanListRecordStatusService', () => {
  let service: UsersBanListRecordStatusService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersBanListRecordStatusService,
        {
          provide: PrismaService,
          useValue: mockUsersBanListRecordStatusRepository,
        },
      ],
    }).compile();

    service = module.get<UsersBanListRecordStatusService>(UsersBanListRecordStatusService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new users ban list record statuses', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createUsersBanListRecordStatusDtoList) {
      expect(await service.create(item)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual([
      ...initialItems,
      ...MockDataStorage.createUsersBanListRecordStatusDtoList,
    ]);

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordStatusRepository.usersBanListRecordStatus.create,
    ).toHaveBeenCalled();
  });

  it('should not create a new users ban list record status because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.create(MockDataStorage.items()[0])).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordStatusRepository.usersBanListRecordStatus.create,
    ).toHaveBeenCalled();
  });

  it('should find all existing users ban list record statuses', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordStatusRepository.usersBanListRecordStatus.findMany,
    ).toHaveBeenCalled();
  });

  it('should find users ban list records list by users ban list record status for all existing users ban list record statuses', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await service.findUsersBanListRecordsWithStatus(item.name)).toEqual(
        item.usersBanListRecords,
      );
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordStatusRepository.usersBanListRecordStatus.findUniqueOrThrow,
    ).toHaveBeenCalled();
  });

  it('should not find users ban list records list by users ban list record status with provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(service.findUsersBanListRecordsWithStatus('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordStatusRepository.usersBanListRecordStatus.findUniqueOrThrow,
    ).toHaveBeenCalled();
  });

  it('should update a list of existing users ban list record statuses by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateUsersBanListRecordStatusDtoList) {
      expect(await service.update(item.name, item.data)).toEqual(item.data);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const dto = MockDataStorage.updateUsersBanListRecordStatusDtoList.find(
          x => x.name === item.name,
        );

        return dto ? dto.data : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordStatusRepository.usersBanListRecordStatus.update,
    ).toHaveBeenCalled();
  });

  it('should not update a users ban list record status by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.update('', { name: '' })).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordStatusRepository.usersBanListRecordStatus.update,
    ).toHaveBeenCalled();
  });

  it('should remove a list of existing users ban list record statuses by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeUsersBanListRecordStatusDtoList) {
      expect(await service.remove(item.name)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeUsersBanListRecordStatusDtoList.find(
          x => x.name === item.name,
        );
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordStatusRepository.usersBanListRecordStatus.delete,
    ).toHaveBeenCalled();
  });

  it('should not remove a users ban list record status by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(
      mockUsersBanListRecordStatusRepository.usersBanListRecordStatus.delete,
    ).toHaveBeenCalled();
  });
});
