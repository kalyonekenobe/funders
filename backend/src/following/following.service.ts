import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateFollowingDto } from './dto/create-following.dto';
import { FollowingEntity } from './entities/following.entity';
import { exclude } from 'src/core/prisma/prisma.utils';
import { UserPublicEntity } from 'src/user/entities/user-public.entity';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';

@Injectable()
export class FollowingService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllUserFollowers(
    userId: string,
    options?: Prisma.FollowingFindManyArgs,
  ): Promise<UserPublicEntity[]> {
    return this.prismaService
      .$transaction(async tx => {
        await tx.user.findUniqueOrThrow({ where: { id: userId } });
        return tx.following.findMany(
          _.merge(options, {
            where: { userId },
            select: {
              follower: { select: exclude('User', ['password']) },
            },
          }),
        );
      })
      .then(result => result.map(entry => entry.follower));
  }

  async findAllUserFollowings(
    followerId: string,
    options?: Prisma.FollowingFindManyArgs,
  ): Promise<UserPublicEntity[]> {
    return this.prismaService
      .$transaction(async tx => {
        await tx.user.findUniqueOrThrow({ where: { id: followerId } });
        return tx.following.findMany(
          _.merge(options, {
            where: { followerId },
            select: {
              user: { select: exclude('User', ['password']) },
            },
          }),
        );
      })
      .then(result => result.map(entry => entry.user));
  }

  async create(data: CreateFollowingDto): Promise<FollowingEntity> {
    return this.prismaService.following.create({
      data,
      include: {
        user: { select: exclude('User', ['password']) },
        follower: { select: exclude('User', ['password']) },
      },
    });
  }

  async remove(userId: string, followerId: string): Promise<FollowingEntity> {
    return this.prismaService.following.delete({
      where: { userId_followerId: { userId, followerId } },
      include: {
        user: { select: exclude('User', ['password']) },
        follower: { select: exclude('User', ['password']) },
      },
    });
  }
}
