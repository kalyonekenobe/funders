import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MockDataStorage, mockPostReactionRepository } from './post-reaction.mock';
import * as request from 'supertest';
import ValidationPipes from 'src/core/config/validation-pipes';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { PostModule } from 'src/post/post.module';
import { PostReactionModule } from 'src/post-reaction/post-reaction.module';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';
import { MockAuthGuard } from 'test/core/auth/mock-auth-guard';
import { JwtStrategy } from 'src/core/auth/strategies/jwt.strategy';
import { MockAuthStrategy } from 'test/core/auth/mock-auth-strategy';
import * as cookieParser from 'cookie-parser';
import { accessToken } from 'test/core/auth/mock-auth';

describe('PostDonationController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostReactionModule, PostModule],
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
      .useValue(mockPostReactionRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    app.use(cookieParser());
    await app.init();
  });

  it('/posts/:id/reactions (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/posts/${MockDataStorage.items()[0].postId}/reactions`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            MockDataStorage.items().filter(
              item => item.postId === MockDataStorage.items()[0].postId,
            ),
          ),
        );
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/reactions (GET) --> 404 NOT FOUND | Post with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/posts/${MockDataStorage.items()[0].postId}_not_existing_id/reactions`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/reactions (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/posts/${MockDataStorage.createPostReactionDtoList[0].postId}/reactions`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.createPostReactionDtoList[0].data)
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...response.body,
            ...MockDataStorage.createPostReactionDtoList[0].data,
          }),
        );
        expect(JSON.stringify(MockDataStorage.items())).toEqual(
          JSON.stringify([...initialData, response.body]),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/reactions (POST) --> 404 NOT FOUND | Post with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(
        `/posts/${MockDataStorage.createPostReactionDtoList[0].postId}_not_existing_id/reactions`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.createPostReactionDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/reactions (POST) --> 409 CONFLICT | Create post reaction dto has invalid format', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/posts/${MockDataStorage.createPostReactionDtoList[0].postId}/reactions`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send({ ...MockDataStorage.items()[0], asdasd: 123 })
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:postId/reactions/:userId (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/posts/${MockDataStorage.updatePostReactionDtoList[0].postId}/reactions/${MockDataStorage.updatePostReactionDtoList[0].userId}`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updatePostReactionDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            Object.assign(
              {},
              MockDataStorage.items().find(
                item =>
                  item.userId === MockDataStorage.updatePostReactionDtoList[0].userId &&
                  item.postId === MockDataStorage.updatePostReactionDtoList[0].postId,
              ),
              MockDataStorage.updatePostReactionDtoList[0].data,
            ),
          ),
        );
        expect(JSON.stringify(MockDataStorage.items())).toEqual(
          JSON.stringify(
            initialData.map(item =>
              item.userId === response.body.userId && item.postId === response.body.postId
                ? response.body
                : item,
            ),
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:postId/reactions/:userId (PUT) --> 404 NOT FOUND | Post reaction with these postId and userId was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/posts/${MockDataStorage.updatePostReactionDtoList[0].postId}_not_existing_id/reactions/${MockDataStorage.updatePostReactionDtoList[0].userId}_not_existing_id`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updatePostReactionDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(JSON.stringify(MockDataStorage.items())).toEqual(JSON.stringify(initialData));
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:postId/reactions/:userId (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/posts/${MockDataStorage.removePostReactionDtoList[0].postId}/reactions/${MockDataStorage.removePostReactionDtoList[0].userId}`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...MockDataStorage.removePostReactionDtoList[0],
            datetime: response.body.datetime,
          }),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(
            item =>
              item.postId !== MockDataStorage.removePostReactionDtoList[0].postId ||
              item.userId !== MockDataStorage.removePostReactionDtoList[0].userId,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:postId/reactions/:userId (DELETE) --> 404 NOT FOUND | Post reaction with these postId and userId was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/posts/${MockDataStorage.removePostReactionDtoList[0].postId}_not_existing_id/reactions/${MockDataStorage.removePostReactionDtoList[0].userId}_not_existing_id`,
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
