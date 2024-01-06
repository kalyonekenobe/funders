import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MockDataStorage, mockChatRepository } from './chat.mock';
import * as request from 'supertest';
import { ChatModule } from 'src/chat/chat.module';

describe('ChatController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ChatModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockChatRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: errors => {
          if (errors.find(error => Object.entries(error.constraints ?? {}).length > 0)) {
            return new ConflictException(
              errors.flatMap(error => Object.values(error.constraints ?? {})),
            );
          }

          return new BadRequestException(
            errors.flatMap(error => Object.values(error.constraints ?? {})),
          );
        },
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );
    await app.init();
  });

  it('/chats (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get('/chats')
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/chats/${MockDataStorage.items()[0].id}`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()[0]));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id (GET) --> 404 NOT FOUND | Chat with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/chats/${MockDataStorage.items()[0].id}_not_existing_id`)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/chats')
      .send(MockDataStorage.createChatDtoList[0])
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({ id: '', ...MockDataStorage.createChatDtoList[0] }),
        );
        expect(MockDataStorage.items()).toEqual([
          ...initialData,
          { id: '', ...MockDataStorage.createChatDtoList[0] },
        ]);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats (POST) --> 409 CONFLICT | Create chat dto has invalid format', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/chats')
      .send(MockDataStorage.items()[0])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/chats/${MockDataStorage.updateChatDtoList[0].id}`)
      .send(MockDataStorage.updateChatDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({ id: response.body.id, ...MockDataStorage.updateChatDtoList[0].data }),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.map(item =>
            item.id === MockDataStorage.updateChatDtoList[0].id
              ? { id: response.body.id, ...MockDataStorage.updateChatDtoList[0].data }
              : item,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id (PUT) --> 404 NOT FOUND | Chat with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/chats/${MockDataStorage.items()[0].id}_not_existing_id`)
      .send(MockDataStorage.updateChatDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/chats/${MockDataStorage.removeChatDtoList[1].id}`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.removeChatDtoList[1]),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(item => item.name !== MockDataStorage.removeChatDtoList[1].name),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chats/:id (DELETE) --> 404 NOT FOUND | Chat with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/chats/${MockDataStorage.removeChatDtoList[0].name}_not_existing_id`)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
