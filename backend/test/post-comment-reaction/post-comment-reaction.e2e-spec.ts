import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MockDataStorage, mockPostCommentReactionRepository } from './post-comment-reaction.mock';
import * as request from 'supertest';
import ValidationPipes from 'src/core/config/validation-pipes';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { PostCommentReactionModule } from 'src/post-comment-reaction/post-comment-reaction.module';
import { PostCommentModule } from 'src/post-comment/post-comment.module';
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
      imports: [PostCommentReactionModule, PostCommentModule],
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
      .useValue(mockPostCommentReactionRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    app.use(cookieParser());
    await app.init();
  });

  it('/comments/:id/reactions (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/comments/${MockDataStorage.items()[0].commentId}/reactions`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            MockDataStorage.items().filter(
              item => item.commentId === MockDataStorage.items()[0].commentId,
            ),
          ),
        );
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/comments/:id/reactions (GET) --> 404 NOT FOUND | Post comment with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/comments/${MockDataStorage.items()[0].commentId}_not_existing_id/reactions`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/comments/:id/reactions (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/comments/${MockDataStorage.createPostCommentReactionDtoList[0].commentId}/reactions`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.createPostCommentReactionDtoList[0].data)
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...response.body,
            ...MockDataStorage.createPostCommentReactionDtoList[0].data,
          }),
        );
        expect(JSON.stringify(MockDataStorage.items())).toEqual(
          JSON.stringify([...initialData, response.body]),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/comments/:id/reactions (POST) --> 404 NOT FOUND | Post comment with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(
        `/comments/${MockDataStorage.createPostCommentReactionDtoList[0].commentId}_not_existing_id/reactions`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.createPostCommentReactionDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/comments/:id/reactions (POST) --> 409 CONFLICT | Create post comment reaction dto has invalid format', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/comments/${MockDataStorage.createPostCommentReactionDtoList[0].commentId}/reactions`)
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send({ ...MockDataStorage.items()[0], asdasd: 123 })
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/comments/:commentId/reactions/:userId (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/comments/${MockDataStorage.updatePostCommentReactionDtoList[0].commentId}/reactions/${MockDataStorage.updatePostCommentReactionDtoList[0].userId}`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updatePostCommentReactionDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            Object.assign(
              {},
              MockDataStorage.items().find(
                item =>
                  item.userId === MockDataStorage.updatePostCommentReactionDtoList[0].userId &&
                  item.commentId === MockDataStorage.updatePostCommentReactionDtoList[0].commentId,
              ),
              MockDataStorage.updatePostCommentReactionDtoList[0].data,
            ),
          ),
        );
        expect(JSON.stringify(MockDataStorage.items())).toEqual(
          JSON.stringify(
            initialData.map(item =>
              item.userId === response.body.userId && item.commentId === response.body.commentId
                ? response.body
                : item,
            ),
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/comments/:commentId/reactions/:userId (PUT) --> 404 NOT FOUND | Post comment reaction with these commentId and userId was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/comments/${MockDataStorage.updatePostCommentReactionDtoList[0].commentId}_not_existing_id/reactions/${MockDataStorage.updatePostCommentReactionDtoList[0].userId}_not_existing_id`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .send(MockDataStorage.updatePostCommentReactionDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(JSON.stringify(MockDataStorage.items())).toEqual(JSON.stringify(initialData));
        MockDataStorage.setDefaultItems();
      });
  });

  it('/comments/:commentId/reactions/:userId (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/comments/${MockDataStorage.removePostCommentReactionDtoList[0].commentId}/reactions/${MockDataStorage.removePostCommentReactionDtoList[0].userId}`,
      )
      .set('authorization', `Bearer ${accessToken}`)
      .set('Cookie', [`Funders-Access-Token=${accessToken}; Path=/; HttpOnly;`])
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...MockDataStorage.removePostCommentReactionDtoList[0],
            datetime: response.body.datetime,
          }),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(
            item =>
              item.commentId !== MockDataStorage.removePostCommentReactionDtoList[0].commentId ||
              item.userId !== MockDataStorage.removePostCommentReactionDtoList[0].userId,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/comments/:commentId/reactions/:userId (DELETE) --> 404 NOT FOUND | Post comment reaction with these commentId and userId was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/comments/${MockDataStorage.removePostCommentReactionDtoList[0].commentId}_not_existing_id/reactions/${MockDataStorage.removePostCommentReactionDtoList[0].userId}_not_existing_id`,
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
