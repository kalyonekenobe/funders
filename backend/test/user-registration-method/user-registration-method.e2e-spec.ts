import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserRegistrationMethodModule } from 'src/user-registration-method/user-registration-method.module';
import {
  MockDataStorage,
  mockUserRegistrationMethodRepository,
} from './user-registration-method.mock';
import * as request from 'supertest';
import ValidationPipes from 'src/core/config/validation-pipes';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

describe('UserRegistrationMethodController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserRegistrationMethodModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockUserRegistrationMethodRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    await app.init();
  });

  it('/user-registration-methods (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get('/user-registration-methods')
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-registration-methods (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/user-registration-methods')
      .send(MockDataStorage.createUserRegistrationMethodDtoList[0])
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.createUserRegistrationMethodDtoList[0]),
        );
        expect(MockDataStorage.items()).toEqual([
          ...initialData,
          MockDataStorage.createUserRegistrationMethodDtoList[0],
        ]);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-registration-methods (POST) --> 409 CONFLICT | User registration method with specified name already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/user-registration-methods')
      .send(MockDataStorage.items()[0])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-registration-methods/:name (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/user-registration-methods/${MockDataStorage.updateUserRegistrationMethodDtoList[0].name}`,
      )
      .send(MockDataStorage.updateUserRegistrationMethodDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.updateUserRegistrationMethodDtoList[0].data),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.map(item =>
            item.name === MockDataStorage.updateUserRegistrationMethodDtoList[0].name
              ? MockDataStorage.updateUserRegistrationMethodDtoList[0].data
              : item,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-registration-methods/:name (PUT) --> 404 NOT FOUND | User registration method with specified name was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/user-registration-methods/${MockDataStorage.createUserRegistrationMethodDtoList[0].name}_not_existing_name`,
      )
      .send(MockDataStorage.updateUserRegistrationMethodDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-registration-methods/:name (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/user-registration-methods/${MockDataStorage.removeUserRegistrationMethodDtoList[1].name}`,
      )
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.removeUserRegistrationMethodDtoList[1]),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(
            item => item.name !== MockDataStorage.removeUserRegistrationMethodDtoList[1].name,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/user-registration-methods/:name (DELETE) --> 404 NOT FOUND | User registration method with specified name was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/user-registration-methods/${MockDataStorage.removeUserRegistrationMethodDtoList[0].name}_not_existing_name`,
      )
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
