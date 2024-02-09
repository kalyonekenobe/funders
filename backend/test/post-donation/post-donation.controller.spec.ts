import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockPostDonationService } from './post-donation.mock';
import { PostDonationController } from 'src/post-donation/post-donation.controller';
import { PostDonationService } from 'src/post-donation/post-donation.service';

describe('PostDonationController', () => {
  let controller: PostDonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostDonationController],
      providers: [
        {
          provide: PostDonationService,
          useValue: mockPostDonationService,
        },
      ],
    }).compile();

    controller = module.get<PostDonationController>(PostDonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find post donations list by post donation id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationService.findById).toHaveBeenCalled();
  });

  it('should not find post donation with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    expect(() => controller.findById('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationService.findById).toHaveBeenCalled();
  });

  it('should update a list of existing post donations by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    const updatedItems: any[] = [];
    for (const item of MockDataStorage.updatePostDonationDtoList) {
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
    expect(mockPostDonationService.update).toHaveBeenCalled();
  });

  it('should not update a post donation with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() =>
      controller.update('', { ...MockDataStorage.updatePostDonationDtoList[0].data }),
    ).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing post donations by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removePostDonationDtoList) {
      const received = await controller.remove(item.id);
      expect(received).toEqual({ ...item, datetime: received.datetime });
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removePostDonationDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationService.remove).toHaveBeenCalled();
  });

  it('should not remove a post donation with provided id because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.remove('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockPostDonationService.remove).toHaveBeenCalled();
  });
});
