import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MockDataStorage, mockPostCategoryRepository } from './post-category.mock';
import * as request from 'supertest';
import { PostCategoryModule } from 'src/post-category/post-category.module';

describe('PostCategoryController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostCategoryModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPostCategoryRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/posts/categories (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get('/posts/categories')
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/categories (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/posts/categories')
      .send(MockDataStorage.createPostCategoryDtoList[0])
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.createPostCategoryDtoList[0]),
        );
        expect(MockDataStorage.items()).toEqual([
          ...initialData,
          MockDataStorage.createPostCategoryDtoList[0],
        ]);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/categories (POST) --> 409 CONFLICT | Post category with specified name already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post('/posts/categories')
      .send(MockDataStorage.items()[0])
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/categories/:name (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/posts/categories/${MockDataStorage.updatePostCategoryDtoList[0].name}`)
      .send(MockDataStorage.updatePostCategoryDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.updatePostCategoryDtoList[0].data),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.map(item =>
            item.name === MockDataStorage.updatePostCategoryDtoList[0].name
              ? MockDataStorage.updatePostCategoryDtoList[0].data
              : item,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/categories/:name (PUT) --> 404 NOT FOUND | Post category with specified name was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(
        `/posts/categories/${MockDataStorage.createPostCategoryDtoList[0].name}_not_existing_name`,
      )
      .send(MockDataStorage.updatePostCategoryDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/categories/:name (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/posts/categories/${MockDataStorage.removePostCategoryDtoList[1].name}`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.removePostCategoryDtoList[1]),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(
            item => item.name !== MockDataStorage.removePostCategoryDtoList[1].name,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/posts/categories/:name (DELETE) --> 404 NOT FOUND | Post category with specified name was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/posts/categories/${MockDataStorage.removePostCategoryDtoList[0].name}_not_existing_name`,
      )
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
