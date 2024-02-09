import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MockDataStorage, mockPostDonationRepository } from './post-donation.mock';
import * as request from 'supertest';
import ValidationPipes from 'src/core/config/validation-pipes';
import { AllExceptionFilter } from 'src/core/exceptions/exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { PostDonationModule } from 'src/post-donation/post-donation.module';
import { PostModule } from 'src/post/post.module';

describe('PostDonationController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostDonationModule, PostModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPostDonationRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(ValidationPipes.validationPipe);
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    await app.init();
  });

  it('/posts/:id/donations (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/posts/${MockDataStorage.items()[0].postId}/donations`)
      .expect(HttpStatus.OK)
      .then(response => {
        console.log(response);
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

  it('/posts/:id/donations (GET) --> 404 NOT FOUND | Post with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/posts/${MockDataStorage.items()[0].postId}_not_existing_id/donations`)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/post-donations/:id (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/post-donations/${MockDataStorage.items()[0].id}`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify(MockDataStorage.items()[0]));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/post-donations/:id (GET) --> 404 NOT FOUND | Post donation with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/post-donations/${MockDataStorage.items()[0].id}_not_existing_id`)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  // it('/posts (POST) --> 201 CREATED', () => {
  //   MockDataStorage.setDefaultItems();

  //   const initialData = [...MockDataStorage.items()];
  //   return request(app.getHttpServer())
  //     .post('/posts')
  //     .send(MockDataStorage.createPostDtoList[0])
  //     .expect(HttpStatus.CREATED)
  //     .then(response => {
  //       expect(JSON.stringify(response.body)).toEqual(
  //         JSON.stringify({ ...response.body, ...MockDataStorage.createPostDtoList[0] }),
  //       );
  //       expect(JSON.stringify(MockDataStorage.items())).toEqual(
  //         JSON.stringify([...initialData, response.body]),
  //       );
  //       MockDataStorage.setDefaultItems();
  //     });
  // });

  // it('/posts (POST) --> 409 CONFLICT | Create post dto has invalid format', () => {
  //   MockDataStorage.setDefaultItems();

  //   const initialData = [...MockDataStorage.items()];
  //   return request(app.getHttpServer())
  //     .post('/posts')
  //     .send({ ...MockDataStorage.items()[0], asdasd: 123 })
  //     .expect(HttpStatus.CONFLICT)
  //     .then(() => {
  //       expect(MockDataStorage.items()).toEqual(initialData);
  //       MockDataStorage.setDefaultItems();
  //     });
  // });

  it('/post-donations/:id (PUT) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/post-donations/${MockDataStorage.updatePostDonationDtoList[0].id}`)
      .send(MockDataStorage.updatePostDonationDtoList[0].data)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(
            Object.assign(
              {},
              MockDataStorage.items().find(
                item => item.id === MockDataStorage.updatePostDonationDtoList[0].id,
              ),
              MockDataStorage.updatePostDonationDtoList[0].data,
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

  it('/post-donations/:id (PUT) --> 404 NOT FOUND | Post with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .put(`/post-donations/${MockDataStorage.items()[0].id}_not_existing_id`)
      .send(MockDataStorage.updatePostDonationDtoList[0].data)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/post-donations/:id (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/post-donations/${MockDataStorage.removePostDonationDtoList[0].id}`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify({
            ...MockDataStorage.removePostDonationDtoList[0],
            datetime: response.body.datetime,
          }),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(item => item.id !== MockDataStorage.removePostDonationDtoList[0].id),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/post-donations/:id (DELETE) --> 404 NOT FOUND | Post donation with specified id was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(`/post-donations/${MockDataStorage.removePostDonationDtoList[0].id}_not_existing_id`)
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
