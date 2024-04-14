import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UsersBanListRecordStatusModule } from 'src/users-ban-list-record-status/users-ban-list-record-status.module';
import {
  MockDataStorage,
  mockUsersBanListRecordStatusRepository,
} from './users-ban-list-record-status.mock';
import * as request from 'supertest';
import ValidationPipes from 'src/core/config/validation-pipes';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { MockAuthGuard } from 'test/core/auth/mock-auth-guard';
import { JwtStrategy } from 'src/core/auth/strategies/jwt.strategy';
import { MockAuthStrategy } from 'test/core/auth/mock-auth-strategy';
import * as cookieParser from 'cookie-parser';
import { accessToken } from 'test/core/auth/mock-auth';

// To allow parsing BigInt to JSON
(BigInt.prototype as any).toJSON = function () {
  return Number(this.toString());
};

describe('UsersBanListRecordStatusController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersBanListRecordStatusModule],
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
      .useValue(mockUsersBanListRecordStatusRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    app.use(cookieParser());
    await app.init();
  });

  it('/ban-statuses (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get('/ban-statuses')
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/ban-statuses (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/ban-statuses')
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.createUsersBanListRecordStatusDtoList[0])
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.createUsersBanListRecordStatusDtoList[0]),
        );
        expect(MockDataStorage.items()).toEqual([
          ...initialData,
          MockDataStorage.createUsersBanListRecordStatusDtoList[0],
        ]);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/ban-statuses (POST) --> 409 CONFLICT | Users ban list record status with specified name already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/ban-statuses')
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.items()[0])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/ban-statuses/:name (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/ban-statuses/${MockDataStorage.updateUsersBanListRecordStatusDtoList[0].name}`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updateUsersBanListRecordStatusDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.updateUsersBanListRecordStatusDtoList[0].data),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.map(item =>
            item.name === MockDataStorage.updateUsersBanListRecordStatusDtoList[0].name
              ? MockDataStorage.updateUsersBanListRecordStatusDtoList[0].data
              : item,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/ban-statuses/:name (PUT) --> 404 NOT FOUND | Users ban list record status with specified name was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/ban-statuses/${MockDataStorage.createUsersBanListRecordStatusDtoList[0].name}_not_existing_name`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updateUsersBanListRecordStatusDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/ban-statuses/:name (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/ban-statuses/${MockDataStorage.removeUsersBanListRecordStatusDtoList[1].name}`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.removeUsersBanListRecordStatusDtoList[1]),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(
            item => item.name !== MockDataStorage.removeUsersBanListRecordStatusDtoList[1].name,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/ban-statuses/:name (DELETE) --> 404 NOT FOUND | Users ban list record status with specified name was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/ban-statuses/${MockDataStorage.removeUsersBanListRecordStatusDtoList[0].name}_not_existing_name`,
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
