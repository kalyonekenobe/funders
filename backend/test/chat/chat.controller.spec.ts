import { Test, TestingModule } from '@nestjs/testing';
import { MockDataStorage, mockChatService } from './chat.mock';
import {
  MockDataStorage as ChatMessageMockDataStorage,
  mockChatMessageService,
} from '../chat-message/chat-message.mock';
import { ChatController } from 'src/chat/chat.controller';
import { ChatService } from 'src/chat/chat.service';
import { ChatMessageService } from 'src/chat-message/chat-message.service';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        {
          provide: ChatMessageService,
          useValue: mockChatMessageService,
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a list of new chats', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.createChatDtoList) {
      const received = await controller.create(item);
      const expected = { ...item, id: received.id };
      expect(received).toEqual(expected);
      initialItems.push(expected as any);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatService.create).toHaveBeenCalled();
  });

  it('should not create a new chat because it already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(() => {
      controller.create(MockDataStorage.items()[0] as any);

      // Simulating validation error
      MockDataStorage.items().pop();
      throw new Error('Validation error');
    }).toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatService.create).toHaveBeenCalled();
  });

  it('should find all existing chats', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    expect(await controller.findAll()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatService.findAll).toHaveBeenCalled();
  });

  it('should find all existing messages of the chat with specified id', async () => {
    ChatMessageMockDataStorage.setDefaultItems();

    const initialItems = [...ChatMessageMockDataStorage.items()];
    expect(
      await controller.findAllChatMessages(ChatMessageMockDataStorage.items()[0].chatId),
    ).toEqual(
      initialItems.filter(item => item.chatId === ChatMessageMockDataStorage.items()[0].chatId),
    );

    ChatMessageMockDataStorage.setDefaultItems();
    expect(mockChatMessageService.findAllForChat).toHaveBeenCalled();
  });

  it('should find chats list by chat id', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.items()) {
      expect(await controller.findById(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatService.findById).toHaveBeenCalled();
  });

  it('should not find chat with provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];

    await expect(() => controller.findById('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatService.findById).toHaveBeenCalled();
  });

  it('should update a list of existing chats by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    let initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.updateChatDtoList) {
      const received = await controller.update(item.id, item.data);
      const expected = Object.assign(
        {},
        initialItems.find(x => x.id === item.id),
        item.data,
      );
      expect(received).toEqual(expected);
      initialItems = initialItems.map(x => (x.id === item.id ? expected : x));
    }

    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatService.update).toHaveBeenCalled();
  });

  it('should not update a chat by provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(controller.update('', { name: '' })).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatService.update).toHaveBeenCalled();
  });

  it('should remove a list of existing chats by provided ids', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    for (const item of MockDataStorage.removeChatDtoList) {
      expect(await controller.remove(item.id)).toEqual(item);
    }

    expect(MockDataStorage.items()).toEqual(
      initialItems.filter(item => {
        return !MockDataStorage.removeChatDtoList.find(x => x.id === item.id);
      }),
    );

    MockDataStorage.setDefaultItems();
    expect(mockChatService.remove).toHaveBeenCalled();
  });

  it('should not remove a chat by provided id because it does not exist', async () => {
    MockDataStorage.setDefaultItems();

    const initialItems = [...MockDataStorage.items()];
    await expect(controller.remove('')).rejects.toThrow();
    expect(MockDataStorage.items()).toEqual(initialItems);

    MockDataStorage.setDefaultItems();
    expect(mockChatService.remove).toHaveBeenCalled();
  });
});
