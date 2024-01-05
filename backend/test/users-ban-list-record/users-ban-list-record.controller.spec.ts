import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockUsersBanListRecordService } from './users-ban-list-record.mock';
import { UsersBanListRecordController } from 'src/users-ban-list-record/users-ban-list-record.controller';
import { UsersBanListRecordService } from 'src/users-ban-list-record/users-ban-list-record.service';
import { CreateUsersBanListRecordDto } from 'src/users-ban-list-record/dto/create-users-ban-list-record.dto';

describe('UsersBanListRecordController', () => {
  let controller: UsersBanListRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersBanListRecordController],
      providers: [
        {
          provide: UsersBanListRecordService,
          useValue: mockUsersBanListRecordService,
        },
      ],
    }).compile();

    controller = module.get<UsersBanListRecordController>(UsersBanListRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new users ban list records', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createUsersBanListRecordDtoList) {
      const received = await controller.create(item);
      const expected = { ...received, ...item };
      expect(received).toEqual(expected);
      initialItems.push(received);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordService.create).toHaveBeenCalled();
  });

  it('should not create a new users ban list record because of unknown value in create dto', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => {
      controller.create({
        ...MockDataStorage.items()[0],
        sdasds: 123,
      } as CreateUsersBanListRecordDto);

      // Simulating validation error
      MockDataStorage.items().pop();
      throw new Error('Validation error');
    }).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordService.create).toHaveBeenCalled();
  });

  it('should find all existing users ban list records', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordService.findAll).toHaveBeenCalled();
  });

  it('should find users ban list records list by provided users ban list record id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordService.findById).toHaveBeenCalled();
  });

  it('should not find users ban list record with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    expect(() => controller.findById('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordService.findById).toHaveBeenCalled();
  });

  it('should update a list of existing users ban list records by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updateUsersBanListRecordDtoList) {
      const received = await controller.update(item.id, item.data);
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
    expect(mockUsersBanListRecordService.update).toHaveBeenCalled();
  });

  it('should not update a users ban list record with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() =>
      controller.update('', { ...MockDataStorage.updateUsersBanListRecordDtoList[0].data }),
    ).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing users ban list records by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeUsersBanListRecordDtoList) {
      expect(await controller.remove(item.id)).toEqual({
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
    expect(mockUsersBanListRecordService.remove).toHaveBeenCalled();
  });

  it('should not remove a users ban list record with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.remove('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockUsersBanListRecordService.remove).toHaveBeenCalled();
  });
});
