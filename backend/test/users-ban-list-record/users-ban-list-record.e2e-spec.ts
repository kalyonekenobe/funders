import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UsersBanListRecordModule } from 'src/users-ban-list-record/users-ban-list-record.module';
import { MockDataStorage, mockUsersBanListRecordRepository } from './users-ban-list-record.mock';
import * as request from 'supertest';

// To allow parsing BigInt to JSON
(BigInt.prototype as any).toJSON = function () {
  return Number(this.toString());
};

describe('UsersBanListRecordController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersBanListRecordModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockUsersBanListRecordRepository)
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

  it('/users-ban-list-records (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get('/users-ban-list-records')
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users-ban-list-records/:id (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/users-ban-list-records/${MockDataStorage.items()[0].id}`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()[0]));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users-ban-list-records/:id (GET) --> 404 NOT FOUND | Users ban list record with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/users-ban-list-records/${MockDataStorage.items()[0].id}_not_existing_id`)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users-ban-list-records (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/users-ban-list-records')
      .send(MockDataStorage.createUsersBanListRecordDtoList[0])
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...response.body,
            ...MockDataStorage.createUsersBanListRecordDtoList[0],
          }),
        );
        expect(JSON.stringify(MockDataStorage.items())).toEqual(
          JSON.stringify([...initialData, response.body]),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users-ban-list-records (POST) --> 409 CONFLICT | Users ban list record create dto has invalid format', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/users-ban-list-records')
      .send({ ...MockDataStorage.items()[0], asfasf: 123 })
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users-ban-list-records/:id (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/users-ban-list-records/${MockDataStorage.updateUsersBanListRecordDtoList[0].id}`)
      .send(MockDataStorage.updateUsersBanListRecordDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            Object.assign(
              {},
              MockDataStorage.items().find(
                item => item.id === MockDataStorage.updateUsersBanListRecordDtoList[0].id,
              ),
              MockDataStorage.updateUsersBanListRecordDtoList[0].data,
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

  it('/users-ban-list-records/:id (PUT) --> 404 NOT FOUND | Users ban list record with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/users-ban-list-records/${MockDataStorage.items()[0].id}_not_existing_id`)
      .send(MockDataStorage.updateUsersBanListRecordDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users-ban-list-records/:id (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/users-ban-list-records/${MockDataStorage.removeUsersBanListRecordDtoList[1].id}`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...MockDataStorage.removeUsersBanListRecordDtoList[1],
            registeredAt: response.body.registeredAt,
          }),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(
            item => item.id !== MockDataStorage.removeUsersBanListRecordDtoList[1].id,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users-ban-list-records/:id (DELETE) --> 404 NOT FOUND | Users ban list record with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/users-ban-list-records/${MockDataStorage.removeUsersBanListRecordDtoList[0].id}_not_existing_id`,
      )
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
