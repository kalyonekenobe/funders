import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { MockDataStorage, mockFollowingRepository } from './following.mock';
import { FollowingModule } from 'src/following/following.module';
import * as request from 'supertest';

describe('FollowingController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FollowingModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockFollowingRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/:id/followers (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/users/${MockDataStorage.items()[0]}/followers`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify([MockDataStorage.items()[0]]));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:id/followings (GET) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .get(`/users/${MockDataStorage.items()[0]}/followings`)
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(JSON.stringify([MockDataStorage.items()[4]]));
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:userId/followers/:followerId (POST) --> 201 CREATED', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(
        `/users/${MockDataStorage.createFollowingDtoList[0].userId}/followers/${MockDataStorage.createFollowingDtoList[0].followerId}`,
      )
      .expect(HttpStatus.CREATED)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.createFollowingDtoList[0]),
        );
        expect(MockDataStorage.items()).toEqual([
          ...initialData,
          MockDataStorage.createFollowingDtoList[0],
        ]);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:userId/followers/:followerId (POST) --> 409 CONFLICT | Following with specified userId and followerId already exists', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .post(
        `/users/${MockDataStorage.items()[0].userId}/followers/${
          MockDataStorage.items()[0].followerId
        }`,
      )
      .expect(HttpStatus.CONFLICT)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:userId/followers/:followerId (DELETE) --> 200 OK', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/users/${MockDataStorage.removeFollowingDtoList[0].userId}/followers/${MockDataStorage.removeFollowingDtoList[0].followerId}`,
      )
      .expect(HttpStatus.OK)
      .then(response => {
        expect(JSON.stringify(response.body)).toEqual(
          JSON.stringify(MockDataStorage.removeFollowingDtoList[0]),
        );
        expect(MockDataStorage.items()).toEqual(
          initialData.filter(
            item =>
              item.userId !== MockDataStorage.removeFollowingDtoList[0].userId ||
              item.followerId !== MockDataStorage.removeFollowingDtoList[0].followerId,
          ),
        );
        MockDataStorage.setDefaultItems();
      });
  });

  it('/users/:userId/followers/:followerId (DELETE) --> 404 NOT FOUND | Following with specified userId and followerId was not found', () => {
    MockDataStorage.setDefaultItems();

    const initialData = [...MockDataStorage.items()];
    return request(app.getHttpServer())
      .delete(
        `/users/${MockDataStorage.createFollowingDtoList[0].userId}/followers/${MockDataStorage.createFollowingDtoList[0].followerId}`,
      )
      .expect(HttpStatus.NOT_FOUND)
      .then(() => {
        expect(MockDataStorage.items()).toEqual(initialData);
        MockDataStorage.setDefaultItems();
      });
  });
});
