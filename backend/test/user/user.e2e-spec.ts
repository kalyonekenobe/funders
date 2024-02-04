import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { MockDataStorage, mockUserRepository } from './user.mock';
import {
  MockDataStorage as BanMockDataStorage,
  mockUsersBanListRecordRepository,
} from '../users-ban-list-record/users-ban-list-record.mock';
import * as request from 'supertest';
import ValidationPipes from 'src/core/config/validation-pipes';
import { MockDataStorage as PostMockDataStorage, mockPostRepository } from 'test/post/post.mock';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

// To allow parsing BigInt to JSON
(BigInt.prototype as any).toJSON = function () {
  return Number(this.toString());
};

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideProvider(PrismaService)
      .useValue(
        Object.assign(
          {},
          { ...mockPostRepository, user: mockUserRepository.user },
          mockUserRepository,
          mockUsersBanListRecordRepository,
        ),
      )
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    await app.init();
  });

  it('/users (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:id (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/users/${MockDataStorage.items()[0].id}`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()[0]));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:id (GET) --> 404 NOT FOUND | User with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/users/${MockDataStorage.items()[0].id}_not_existing_id`)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:id/bans (GET) --> 200 OK', () => {
    BanMockDataStorage.setDefaultItems();

    const initialData = [...BanMockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/users/${BanMockDataStorage.items()[1].userId}/bans`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            BanMockDataStorage.items().filter(
              item => item.userId === BanMockDataStorage.items()[1].userId,
            ),
          ),
        );
        expect(BanMockDataStorage.items()).toEqual(initialData);
        BanMockDataStorage.setDefaultItems();
      });
  });

  it('/users/:id/posts (GET) --> 200 OK', () => {
    PostMockDataStorage.setDefaultItems();

    const initialData = [...PostMockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/users/${PostMockDataStorage.items()[0].authorId}/posts`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            PostMockDataStorage.items().filter(
              item => item.authorId === PostMockDataStorage.items()[0].authorId,
            ),
          ),
        );
        expect(PostMockDataStorage.items()).toEqual(initialData);
        PostMockDataStorage.setDefaultItems();
      });
  });

  it('/users/:id/bans (POST) --> 201 CREATED', () => {
    BanMockDataStorage.setDefaultItems();

    const initialData = [...BanMockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/users/${BanMockDataStorage.createUsersBanListRecordDtoList[0].userId}/bans`)
      .send({ ...BanMockDataStorage.createUsersBanListRecordDtoList[0], userId: undefined })
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...response.body,
            ...BanMockDataStorage.createUsersBanListRecordDtoList[0],
          }),
        );
        expect(JSON.stringify(BanMockDataStorage.items())).toEqual(
          JSON.stringify([...initialData, response.body]),
        );
        BanMockDataStorage.setDefaultItems();
      });
  });

  it('/users/:id/bans (POST) --> 409 CONFLICT | Users ban list record create dto has invalid format', () => {
    BanMockDataStorage.setDefaultItems();

    const initialData = [...BanMockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/users/${BanMockDataStorage.items()[0].id}/bans`)
      .send({ ...BanMockDataStorage.items()[0], asfasf: 123 })
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(BanMockDataStorage.items()).toEqual(initialData);
        BanMockDataStorage.setDefaultItems();
      });
  });

  it('/users (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/users')
      .send(MockDataStorage.createUserDtoList[0])
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(
          JSON.stringify({
            ...response.body,
            password: MockDataStorage.createUserDtoList[0].password,
          }),
        ).toEqual(JSON.stringify({ ...response.body, ...MockDataStorage.createUserDtoList[0] }));
        expect(JSON.stringify(MockDataStorage.items())).toEqual(
          JSON.stringify([...initialData, response.body]),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users (POST) --> 409 CONFLICT | User with specified email already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/users')
      .send(MockDataStorage.items()[0])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:id (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/users/${MockDataStorage.updateUserDtoList[0].id}`)
      .send(MockDataStorage.updateUserDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            Object.assign(
              {},
              MockDataStorage.items().find(
                item => item.id === MockDataStorage.updateUserDtoList[0].id,
              ),
              MockDataStorage.updateUserDtoList[0].data,
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

  it('/users/:id (PUT) --> 404 NOT FOUND | User with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/users/${MockDataStorage.items()[0].id}_not_existing_id`)
      .send(MockDataStorage.updateUserDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:id (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/users/${MockDataStorage.removeUserDtoList[1].id}`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...MockDataStorage.removeUserDtoList[1],
            registeredAt: response.body.registeredAt,
          }),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(item => item.id !== MockDataStorage.removeUserDtoList[1].id),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:id (DELETE) --> 404 NOT FOUND | User with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/users/${MockDataStorage.removeUserDtoList[0].id}_not_existing_id`)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
