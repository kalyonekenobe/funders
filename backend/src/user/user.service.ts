import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PasswordService } from 'src/core/password/password.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { UserPublicEntity } from './entities/user-public.entity';
import { exclude } from 'src/core/prisma/prisma.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserFilesOptions, UserRequestBodyFiles } from './user.types';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(): Promise<UserPublicEntity[]> {
    return this.prismaService.user.findMany({ select: exclude('User', ['password']) });
  }

  async findById(id: string): Promise<UserPublicEntity> {
    return this.prismaService.user.findUniqueOrThrow({
      where: { id },
      select: exclude('User', ['password']),
    });
  }

  async findByEmail(email: string): Promise<UserPublicEntity> {
    return this.prismaService.user.findUniqueOrThrow({
      where: { email },
      select: exclude('User', ['password']),
    });
  }

  async create(data: CreateUserDto, files?: UserRequestBodyFiles): Promise<UserPublicEntity> {
    const [avatar] = await this.uploadRequestBodyFiles(data, files);

    return this.prismaService.user.create({
      data: { ...data, avatar, password: await this.passwordService.hash(data.password) },
      select: exclude('User', ['password']),
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

    await this.removeRequestBodyFiles(id, {
      avatar: (files?.avatar && files.avatar.length > 0) || data.avatar !== undefined,
    });
    const [avatar] = await this.uploadRequestBodyFiles(data, files, id);

    return this.prismaService.user.update({
      data: { ...data, avatar },
      where: { id },
      select: exclude('User', ['password']),
    });
  }

  async remove(id: string) {
    await this.removeRequestBodyFiles(id);
    return this.prismaService.user.delete({ where: { id }, select: exclude('User', ['password']) });
  }

  private async removeRequestBodyFiles(
    userId: string,
    options: RemoveUserFilesOptions = { avatar: true },
  ): Promise<void> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      select: { avatar: true },
    });

    if (options.avatar && user.avatar) {
      this.cloudinaryService.removeFiles([{ public_id: user.avatar, resource_type: 'image' }]);
    }
  }

  private async uploadRequestBodyFiles(
    data: CreateUserDto | UpdateUserDto,
    files?: UserRequestBodyFiles,
    userId?: string,
  ): Promise<[string | null]> {
    let avatar: string | null = null;

    if (files?.avatar && files.avatar.length > 0) {
      const resource = (
        await this.cloudinaryService.uploadFiles(files.avatar, {
          folder: 'users',
        })
      )[0] as UploadApiResponse;
      avatar = resource.public_id ?? null;
    } else if (userId && (data as UpdateUserDto).avatar === undefined) {
      avatar = (await this.findById(userId)).avatar ?? null;
    }

    return [avatar];
  }
}
