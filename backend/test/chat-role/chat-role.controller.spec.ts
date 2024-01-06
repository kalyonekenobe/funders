import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockChatRoleService } from './chat-role.mock';
import { ChatRoleController } from 'src/chat-role/chat-role.controller';
import { ChatRoleService } from 'src/chat-role/chat-role.service';

describe('ChatRoleController', () => {
  let controller: ChatRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatRoleController],
      providers: [
        {
          provide: ChatRoleService,
          useValue: mockChatRoleService,
        },
      ],
    }).compile();

    controller = module.get<ChatRoleController>(ChatRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new chat roles', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createChatRoleDtoList) {
      expect(await controller.create(item)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual([
      ...initialItems,
      ...MockDataStorage.createChatRoleDtoList,
    ]);

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleService.create).toHaveBeenCalled();
  });

  it('should not create a new chat role because it already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.create(MockDataStorage.items()[0])).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleService.create).toHaveBeenCalled();
  });

  it('should find all existing chat roles', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleService.findAll).toHaveBeenCalled();
  });

  it('should update a list of existing chat roles by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateChatRoleDtoList) {
      expect(await controller.update(item.name, item.data)).toEqual(item.data);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const dto = MockDataStorage.updateChatRoleDtoList.find(x => x.name === item.name);

        return dto ? dto.data : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleService.update).toHaveBeenCalled();
  });

  it('should not update a chat role by provided name because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.update('', { name: '' })).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing chat roles by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeChatRoleDtoList) {
      expect(await controller.remove(item.name)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeChatRoleDtoList.find(x => x.name === item.name);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleService.remove).toHaveBeenCalled();
  });

  it('should not remove a chat role by provided name because it does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => controller.remove('')).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleService.remove).toHaveBeenCalled();
  });
});
