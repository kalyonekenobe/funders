import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PasswordService } from 'src/core/password/password.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { UserPublicEntity } from './entities/user-public.entity';
import { exclude } from 'src/core/prisma/prisma.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRequestBodyFiles } from './types/user.types';
import {
  IPrepareSingleResourceForDelete,
  IPrepareSingleResourceForUpload,
} from 'src/core/cloudinary/cloudinary.types';
import { PaymentService } from 'src/core/payment/payment.service';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly paymentService: PaymentService,
  ) {}

  async findAll(options?: Prisma.UserFindManyArgs): Promise<UserPublicEntity[]> {
    return this.prismaService.user.findMany(
      _.merge(options, {
        select: exclude('User', ['password']),
      }),
    );
  }

  async findById(id: string, options?: Prisma.UserFindFirstOrThrowArgs): Promise<UserPublicEntity> {
    return this.prismaService.user.findUniqueOrThrow(
      _.merge(options, {
        where: { id },
        select: { ...exclude('User', ['password']), userRole: true },
      }),
    );
  }

  async findByEmail(email: string): Promise<UserPublicEntity> {
    return this.prismaService.user.findUniqueOrThrow({
      where: { email },
      select: { ...exclude('User', ['password']), userRole: true },
    });
  }

  async findOne(options?: Prisma.UserFindFirstOrThrowArgs): Promise<UserPublicEntity> {
    return this.prismaService.user.findFirstOrThrow(
      _.merge(options, {
        select: { ...exclude('User', ['password']), userRole: true },
      }),
    );
  }

  async create(data: CreateUserDto, files?: UserRequestBodyFiles): Promise<UserPublicEntity> {
    let uploader: IPrepareSingleResourceForUpload | undefined = undefined;

    if (files?.avatar && files.avatar.length > 0) {
      uploader = this.cloudinaryService.prepareSingleResourceForUpload(files.avatar[0], {
        mapping: { [`${files.avatar[0].fieldname}`]: 'users' },
      });
    }

    const stripeCustomer = await this.paymentService.createCustomer({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
    });

    return this.prismaService.user
      .create({
        data: {
          ...data,
          avatar: uploader?.resource.publicId ?? null,
          password: await this.passwordService.hash(data.password),
          stripeCustomerId: stripeCustomer.id,
        },
        select: exclude('User', ['password']),
      })
      .then(async response => {
        if (uploader) await uploader.upload();
        return response;
      })
      .catch(error => {
        this.paymentService.deleteCustomer(stripeCustomer.id);
        throw error;
      });
  }

  async update(
    id: string,
    data: UpdateUserDto,
    files?: UserRequestBodyFiles,
  ): Promise<UserPublicEntity> {
    if (data.password !== undefined) {
      data.password = await this.passwordService.hash(data.password);
    }

    const user = await this.findById(id);

    let uploader: IPrepareSingleResourceForUpload | undefined = undefined;
    let destroyer: IPrepareSingleResourceForDelete | undefined = undefined;
    let avatar = user.avatar;

    if (files?.avatar && files.avatar.length > 0) {
      uploader = this.cloudinaryService.prepareSingleResourceForUpload(files.avatar[0], {
        mapping: { [`${files.avatar[0].fieldname}`]: 'users' },
      });
      avatar = uploader?.resource.publicId ?? avatar;
    }

    if (((files?.avatar && files.avatar.length > 0) || data.avatar !== undefined) && user.avatar) {
      destroyer = this.cloudinaryService.prepareSingleResourceForDelete({
        publicId: user.avatar,
        resourceType: 'image',
      });
      avatar = uploader?.resource.publicId ?? null;
    }

    this.paymentService.updateCustomer(user.stripeCustomerId, {
      name: `${data.firstName ?? user.firstName} ${data.lastName ?? user.lastName}`,
    });

    return this.prismaService.user
      .update({
        data: { ...data, avatar },
        where: { id },
        select: exclude('User', ['password']),
      })
      .then(async response => {
        if (uploader) await uploader.upload();
        if (destroyer) destroyer.delete();
        return response;
      })
      .catch(error => {
        this.paymentService.updateCustomer(user.stripeCustomerId, {
          name: `${user.firstName} ${user.lastName} `,
        });
        throw error;
      });
  }

  async remove(id: string): Promise<UserPublicEntity> {
    return this.prismaService.user
      .delete({ where: { id }, select: exclude('User', ['password']) })
      .then(response => {
        if (response.avatar) {
          const destroyer = this.cloudinaryService.prepareSingleResourceForDelete({
            publicId: response.avatar,
            resourceType: 'image',
          });

          destroyer.delete();
        }

        this.paymentService.deleteCustomer(response.stripeCustomerId);

        return response;
      });
  }
}
