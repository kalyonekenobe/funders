import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MockDataStorage, mockCategoriesOnPostsRepository } from './categories-on-posts.mock';
import * as request from 'supertest';
import { CategoriesOnPostsModule } from 'src/categories-on-posts/categories-on-posts.module';
import ValidationPipes from 'src/core/config/validation-pipes';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

describe('FollowingController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoriesOnPostsModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockCategoriesOnPostsRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    await app.init();
  });

  it('/posts/:id/categories (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/posts/${MockDataStorage.items()[0].postId}/categories`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            MockDataStorage.items()
              .filter(item => item.postId === MockDataStorage.items()[0].postId)
              .map(item => ({ name: item.category })),
          ),
        );
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/categories (GET) --> 404 NOT FOUND | Post with specified id does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/posts/${MockDataStorage.items()[0].postId}_not_existing_id/categories`)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/categories (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/posts/${MockDataStorage.createCategoriesOnPostsDtoList[0].postId}/categories`)
      .send(MockDataStorage.createCategoriesOnPostsDtoList[0].data)
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.createCategoriesOnPostsDtoList[0].data),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.concat(
            MockDataStorage.createCategoriesOnPostsDtoList[0].data.map(item => ({
              postId: MockDataStorage.createCategoriesOnPostsDtoList[0].postId,
              category: item.name,
            })),
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/categories (POST) --> 404 NOT FOUND | Post with specified id does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(
        `/posts/${MockDataStorage.createCategoriesOnPostsDtoList[0].postId}_not_existing_id/categories`,
      )
      .send(MockDataStorage.createCategoriesOnPostsDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/categories (POST) --> 409 Conflict | Category with specified name already exists for the post with specified id', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(`/posts/${MockDataStorage.items()[0].postId}/categories`)
      .send([{ name: MockDataStorage.items()[0].category }])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/categories (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/posts/${MockDataStorage.updateCategoriesOnPostsDtoList[0].postId}/categories`)
      .send(MockDataStorage.updateCategoriesOnPostsDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.updateCategoriesOnPostsDtoList[0].data),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData
            .filter(
              item => item.postId !== MockDataStorage.updateCategoriesOnPostsDtoList[0].postId,
            )
            .concat(
              MockDataStorage.updateCategoriesOnPostsDtoList[0].data.map(item => ({
                postId: MockDataStorage.updateCategoriesOnPostsDtoList[0].postId,
                category: item.name,
              })),
            ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/categories (PUT) --> 404 NOT FOUND | Post with specified id does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/posts/${MockDataStorage.updateCategoriesOnPostsDtoList[0].postId}_not_existing_id/categories`,
      )
      .send(MockDataStorage.updateCategoriesOnPostsDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/categories (PUT) --> 409 Conflict | Invalid update categories list of post data was provided', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/posts/${MockDataStorage.items()[0].postId}/categories`)
      .send([{ name: MockDataStorage.items()[0].category, asdasd: 123 }])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/categories (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/posts/${MockDataStorage.removeCategoriesOnPostsDtoList[0].postId}/categories`)
      .send(MockDataStorage.removeCategoriesOnPostsDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.removeCategoriesOnPostsDtoList[0].data),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(
            item =>
              !(
                item.postId === MockDataStorage.removeCategoriesOnPostsDtoList[0].postId &&
                MockDataStorage.removeCategoriesOnPostsDtoList[0].data.find(
                  category => category.name === item.category,
                )
              ),
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/categories (DELETE) --> 404 NOT FOUND | Post with specified id does not exist', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/posts/${MockDataStorage.removeCategoriesOnPostsDtoList[0].postId}_not_existing_id/categories`,
      )
      .send(MockDataStorage.removeCategoriesOnPostsDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/:id/categories (DELETE) --> 409 Conflict | Invalid update categories list of post data was provided', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/posts/${MockDataStorage.items()[0].postId}/categories`)
      .send([{ name: MockDataStorage.items()[0].category, asdasd: 123 }])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
