import { Test, TestingModule } from '@nestjs/testing';
import { UsersBanListRecordStatusController } from 'src/users-ban-list-record-status/users-ban-list-record-status.controller';
import { UsersBanListRecordStatusService } from 'src/users-ban-list-record-status/users-ban-list-record-status.service';
import {
  MockDataStorage,
  mockUsersBanListRecordStatusService,
} from './users-ban-list-record-status.mock';

describe('UsersBanListRecordStatusController', () => {
  let controller: UsersBanListRecordStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersBanListRecordStatusController],
      providers: [
        {
          provide: UsersBanListRecordStatusService,
          useValue: mockUsersBanListRecordStatusService,
        },
      ],
    }).compile();

    controller = module.get<UsersBanListRecordStatusController>(UsersBanListRecordStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new users ban list record statuses', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createUsersBanListRecordStatusDtoList) {
      expect(await controller.create(item)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual([
      ...initialItems,
      ...MockDataStorage.createUsersBanListRecordStatusDtoList,
    ]);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordStatusService.create).toHaveBeenCalled();
  });

  it('should not create a new users ban list record status because it already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.create(MockDataStorage.items()[0])).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordStatusService.create).toHaveBeenCalled();
  });

  it('should find all existing users ban list record statuses', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordStatusService.findAll).toHaveBeenCalled();
  });

  it('should update a list of existing users ban list record statuses by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateUsersBanListRecordStatusDtoList) {
      expect(await controller.update(item.name, item.data)).toEqual(item.data);
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
    expect(mockUsersBanListRecordStatusService.update).toHaveBeenCalled();
  });

  it('should not update a users ban list record status by provided name because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.update('', { name: '' })).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordStatusService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing users ban list record statuses by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeUsersBanListRecordStatusDtoList) {
      expect(await controller.remove(item.name)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeUsersBanListRecordStatusDtoList.find(
          x => x.name === item.name,
        );
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordStatusService.remove).toHaveBeenCalled();
  });

  it('should not remove a users ban list record status by provided name because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.remove('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordStatusService.remove).toHaveBeenCalled();
  });
});
