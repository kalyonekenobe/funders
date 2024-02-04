import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserReactionTypeModule } from 'src/user-reaction-type/user-reaction-type.module';
import { MockDataStorage, mockUserReactionTypeRepository } from './user-reaction-type.mock';
import * as request from 'supertest';
import ValidationPipes from 'src/core/config/validation-pipes';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

describe('UserReactionTypeController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserReactionTypeModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockUserReactionTypeRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    await app.init();
  });

  it('/user-reaction-types (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get('/user-reaction-types')
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-reaction-types (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/user-reaction-types')
      .send(MockDataStorage.createUserRactionTypeDtoList[0])
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.createUserRactionTypeDtoList[0]),
        );
        expect(MockDataStorage.items()).toEqual([
          ...initialData,
          MockDataStorage.createUserRactionTypeDtoList[0],
        ]);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-reaction-types (POST) --> 409 CONFLICT | User reaction type with specified name already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/user-reaction-types')
      .send(MockDataStorage.items()[0])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-reaction-types/:name (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/user-reaction-types/${MockDataStorage.updateUserReactionTypeDtoList[0].name}`)
      .send(MockDataStorage.updateUserReactionTypeDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.updateUserReactionTypeDtoList[0].data),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.map(item =>
            item.name === MockDataStorage.updateUserReactionTypeDtoList[0].name
              ? MockDataStorage.updateUserReactionTypeDtoList[0].data
              : item,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-reaction-types/:name (PUT) --> 404 NOT FOUND | User reaction type with specified name was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/user-reaction-types/${MockDataStorage.createUserRactionTypeDtoList[0].name}_not_existing_name`,
      )
      .send(MockDataStorage.updateUserReactionTypeDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-reaction-types/:name (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/user-reaction-types/${MockDataStorage.removeUserReactionTypeDtoList[1].name}`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.removeUserReactionTypeDtoList[1]),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(
            item => item.name !== MockDataStorage.removeUserReactionTypeDtoList[1].name,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-reaction-types/:name (DELETE) --> 404 NOT FOUND | User reaction type with specified name was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/user-reaction-types/${MockDataStorage.removeUserReactionTypeDtoList[0].name}_not_existing_name`,
      )
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
