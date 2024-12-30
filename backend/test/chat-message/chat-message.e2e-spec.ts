import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MockDataStorage, mockChatMessageRepository } from './chat-message.mock';
import * as request from 'supertest';
import ValidationPipes from 'src/core/config/validation-pipes';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';
import { ChatModule } from 'src/chat/chat.module';
import { mockChatRepository } from 'test/chat/chat.mock';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { MockAuthGuard } from 'test/core/auth/mock-auth-guard';
import { JwtStrategy } from 'src/core/auth/strategies/jwt.strategy';
import { MockAuthStrategy } from 'test/core/auth/mock-auth-strategy';
import * as cookieParser from 'cookie-parser';
import { accessToken } from 'test/core/auth/mock-auth';

describe('ChatMessageController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ChatMessageModule, ChatModule],
      providers: [
        {
          provide: JwtAuthGuard,
          useValue: MockAuthGuard,
        },
        {
          provide: JwtStrategy,
          useClass: MockAuthStrategy,
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue({
        ...mockChatRepository,
        ...mockChatMessageRepository,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    app.use(cookieParser());
    await app.init();
  });

  it('/chats/:id/messages (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/chats/${MockDataStorage.items()[4].chatId}/messages`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            MockDataStorage.items().filter(
              item => item.chatId === MockDataStorage.items()[4].chatId,
            ),
          ),
        );
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id/messages (GET) --> 404 NOT FOUND | Chat with specified id was not found.', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/chats/${MockDataStorage.items()[4].chatId}_not_existing_id/messages`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/messages/:id (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/messages/${MockDataStorage.items()[0].id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()[0]));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/messages/:id (GET) --> 404 NOT FOUND | Chat message with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/messages/${MockDataStorage.items()[0].id}_not_existing_id`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id/messages (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/chats/${MockDataStorage.createChatMessageDtoList[0].chatId}/messages`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send({
        authorId: MockDataStorage.createChatMessageDtoList[0].data.authorId,
        replyTo: MockDataStorage.createChatMessageDtoList[0].data.replyTo,
        text: MockDataStorage.createChatMessageDtoList[0].data.text,
      })
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...response.body,
            ...{
              authorId: MockDataStorage.createChatMessageDtoList[0].data.authorId,
              replyTo: MockDataStorage.createChatMessageDtoList[0].data.replyTo,
              text: MockDataStorage.createChatMessageDtoList[0].data.text,
            },
          }),
        );
        expect(JSON.stringify(MockDataStorage.items())).toEqual(
          JSON.stringify([...initialData, response.body]),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id/messages (POST) --> 409 CONFLICT | Create chat message dto has invalid format', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/chats/${MockDataStorage.items()[0]}/messages`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send({ ...MockDataStorage.items()[0], asdasd: 123 })
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/messages/:id (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/messages/${MockDataStorage.updateChatMessageDtoList[0].id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updateChatMessageDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            Object.assign(
              {},
              MockDataStorage.items().find(
                item => item.id === MockDataStorage.updateChatMessageDtoList[0].id,
              ),
              MockDataStorage.updateChatMessageDtoList[0].data,
            ),
          ),
        );
        expect(JSON.stringify(MockDataStorage.items())).toEqual(
          JSON.stringify(
            initialData.map(item => (item.id === response.body.id ? response.body : item)),
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/messages/:id (PUT) --> 404 NOT FOUND | Chat message with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/messages/${MockDataStorage.items()[0].id}_not_existing_id`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updateChatMessageDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/messages/:id (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/messages/${MockDataStorage.removeChatMessageDtoList[0].id}`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...MockDataStorage.removeChatMessageDtoList[0],
            createdAt: response.body.createdAt,
            updatedAt: response.body.updatedAt,
            removedAt: response.body.removedAt,
          }),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(item => item.id !== MockDataStorage.removeChatMessageDtoList[0].id),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/messages/:id (DELETE) --> 404 NOT FOUND | Chat message with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/messages/${MockDataStorage.removeChatMessageDtoList[0].id}_not_existing_id`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
