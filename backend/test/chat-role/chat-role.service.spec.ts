import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockChatRoleRepository } from './chat-role.mock';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ChatRoleService } from 'src/chat-role/chat-role.service';

describe('ChatRoleService', () => {
  let service: ChatRoleService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatRoleService,
        {
          provide: PrismaService,
          useValue: mockChatRoleRepository,
        },
      ],
    }).compile();

    service = module.get<ChatRoleService>(ChatRoleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a list of new chat roles', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createChatRoleDtoList) {
      expect(await service.create(item)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual([
      ...initialItems,
      ...MockDataStorage.createChatRoleDtoList,
    ]);

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleRepository.chatRole.create).toHaveBeenCalled();
  });

  it('should not create a new chat role because it already exists', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.create(MockDataStorage.items()[0])).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleRepository.chatRole.create).toHaveBeenCalled();
  });

  it('should find all existing chat roles', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await service.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleRepository.chatRole.findMany).toHaveBeenCalled();
  });

  it('should update a list of existing chat roles by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateChatRoleDtoList) {
      expect(await service.update(item.name, item.data)).toEqual(item.data);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.map(item => {
        const dto = MockDataStorage.updateChatRoleDtoList.find(x => x.name === item.name);

        return dto ? dto.data : item;
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleRepository.chatRole.update).toHaveBeenCalled();
  });

  it('should not update a chat role by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.update('', { name: '' })).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleRepository.chatRole.update).toHaveBeenCalled();
  });

  it('should remove a list of existing chat roles by provided names', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeChatRoleDtoList) {
      expect(await service.remove(item.name)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeChatRoleDtoList.find(x => x.name === item.name);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleRepository.chatRole.delete).toHaveBeenCalled();
  });

  it('should not remove a chat role by provided name because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(service.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatRoleRepository.chatRole.delete).toHaveBeenCalled();
  });
});
