import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MockDataStorage, mockChatsOnUsersRepository } from './chats-on-users.mock';
import * as request from 'supertest';
import ValidationPipes from 'src/core/config/validation-pipes';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { ChatsOnUsersModule } from 'src/chats-on-users/chats-on-users.module';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { MockAuthGuard } from 'test/core/auth/mock-auth-guard';
import { JwtStrategy } from 'src/core/auth/strategies/jwt.strategy';
import { MockAuthStrategy } from 'test/core/auth/mock-auth-strategy';
import * as cookieParser from 'cookie-parser';
import { accessToken } from 'test/core/auth/mock-auth';

describe('ChatsOnUsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ChatsOnUsersModule],
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
      .useValue(mockChatsOnUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    app.use(cookieParser());
    await app.init();
  });

  it('/chats/:id/users (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/chats/${MockDataStorage.items()[0].chatId}/users`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            MockDataStorage.items()
              .filter(item => item.chatId === MockDataStorage.items()[0].chatId)
              .map(item => item.user),
          ),
        );
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id/users (GET) --> 404 NOT FOUND | Chat with specified id does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/chats/${MockDataStorage.items()[0].chatId}_not_existing_id/users`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:chatId/users/:userId (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/chats/${MockDataStorage.items()[0].chatId}/users/${MockDataStorage.items()[0].userId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()[0]));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:chatId/users/:userId (GET) --> 404 NOT FOUND | Chat or user with specified id does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(
        `/chats/${MockDataStorage.items()[0].chatId}_not_existing_id/users/${
          MockDataStorage.items()[0].userId
        }`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id/users (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/chats/${MockDataStorage.createChatsOnUsersDtoList[0].chatId}/users`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.createChatsOnUsersDtoList[0].data)
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...MockDataStorage.createChatsOnUsersDtoList[0].data,
            chatId: MockDataStorage.createChatsOnUsersDtoList[0].chatId,
          }),
        );
        expect(MockDataStorage.items()).toEqual([...initialData, response.body]);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id/users (POST) --> 404 NOT FOUND | Chat with specified id does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/chats/${MockDataStorage.createChatsOnUsersDtoList[0].chatId}_not_existing_id/users`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.createChatsOnUsersDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id/users (POST) --> 409 Conflict | Invalid create chats on users entity was provided', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/chats/${MockDataStorage.items()[0].chatId}/users`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send([{ role: 14 }])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:chatId/users/:userId (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/chats/${MockDataStorage.updateChatsOnUsersDtoList[0].chatId}/users/${MockDataStorage.updateChatsOnUsersDtoList[0].userId}`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updateChatsOnUsersDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...MockDataStorage.items().find(
              item =>
                item.chatId === MockDataStorage.updateChatsOnUsersDtoList[0].chatId &&
                item.userId === MockDataStorage.updateChatsOnUsersDtoList[0].userId,
            ),
            ...MockDataStorage.updateChatsOnUsersDtoList[0].data,
          }),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.map(item =>
            item.chatId === MockDataStorage.updateChatsOnUsersDtoList[0].chatId &&
            item.userId === MockDataStorage.updateChatsOnUsersDtoList[0].userId
              ? {
                  ...item,
                  ...MockDataStorage.updateChatsOnUsersDtoList[0].data,
                }
              : item,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:chatId/users/:userId (PUT) --> 404 NOT FOUND | Chat or user with specified id does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/chats/${MockDataStorage.updateChatsOnUsersDtoList[0].chatId}_not_existing_id/users/${MockDataStorage.updateChatsOnUsersDtoList[0].userId}`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updateChatsOnUsersDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:chatId/users/:userId (PUT) --> 409 Conflict | Invalid update chats on users entity was provided', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/chats/${MockDataStorage.items()[0].chatId}/users/${MockDataStorage.items()[0].userId}`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send([{ role: 151 }])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:chatId/users/:userId (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/chats/${MockDataStorage.removeCategoriesOnPostsDtoList[0].chatId}/users/${MockDataStorage.removeCategoriesOnPostsDtoList[0].userId}`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.removeCategoriesOnPostsDtoList[0]),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(
            item =>
              !(
                item.chatId === MockDataStorage.removeCategoriesOnPostsDtoList[0].chatId &&
                item.userId === MockDataStorage.removeCategoriesOnPostsDtoList[0].userId
              ),
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:chatId/users/:userId (DELETE) --> 404 NOT FOUND | Chat or user with specified id does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/chats/${MockDataStorage.removeCategoriesOnPostsDtoList[0].chatId}_not_existing_id/users/${MockDataStorage.removeCategoriesOnPostsDtoList[0].userId}`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
