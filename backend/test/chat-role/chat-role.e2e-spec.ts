import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MockDataStorage, mockChatRoleRepository } from './chat-role.mock';
import * as request from 'supertest';
import { ChatRoleModule } from 'src/chat-role/chat-role.module';
import ValidationPipes from 'src/core/config/validation-pipes';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { MockAuthGuard } from 'test/core/auth/mock-auth-guard';
import { JwtStrategy } from 'src/core/auth/strategies/jwt.strategy';
import { MockAuthStrategy } from 'test/core/auth/mock-auth-strategy';
import * as cookieParser from 'cookie-parser';
import { accessToken } from 'test/core/auth/mock-auth';

describe('ChatRoleController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ChatRoleModule],
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
      .useValue(mockChatRoleRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    app.use(cookieParser());
    await app.init();
  });

  it('/chat-roles (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get('/chat-roles')
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chat-roles (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/chat-roles')
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.createChatRoleDtoList[0])
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.createChatRoleDtoList[0]),
        );
        expect(MockDataStorage.items()).toEqual([
          ...initialData,
          MockDataStorage.createChatRoleDtoList[0],
        ]);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chat-roles (POST) --> 409 CONFLICT | Chat role with specified name already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/chat-roles')
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.items()[0])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chat-roles/:name (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/chat-roles/${MockDataStorage.updateChatRoleDtoList[0].name}`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updateChatRoleDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.updateChatRoleDtoList[0].data),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.map(item =>
            item.name === MockDataStorage.updateChatRoleDtoList[0].name
              ? MockDataStorage.updateChatRoleDtoList[0].data
              : item,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chat-roles/:name (PUT) --> 404 NOT FOUND | Chat role with specified name was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/chat-roles/${MockDataStorage.createChatRoleDtoList[0].name}_not_existing_name`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updateChatRoleDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chat-roles/:name (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/chat-roles/${MockDataStorage.removeChatRoleDtoList[1].name}`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.removeChatRoleDtoList[1]),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(item => item.name !== MockDataStorage.removeChatRoleDtoList[1].name),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/chat-roles/:name (DELETE) --> 404 NOT FOUND | Chat role with specified name was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/chat-roles/${MockDataStorage.removeChatRoleDtoList[0].name}_not_existing_name`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
