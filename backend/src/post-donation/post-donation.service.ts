import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreatePostDonationDto } from './dto/create-post-donation.dto';
import { PostDonationEntity } from './entities/post-donation.entity';
import { UpdatePostDonationDto } from './dto/update-post-donation.dto';

@Injectable()
export class PostDonationService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<PostDonationEntity> {
    return this.prismaService.postDonation.findUniqueOrThrow({ where: { id } });
  }

  async findAllForPost(postId: string): Promise<PostDonationEntity[]> {
    return this.prismaService.$transaction(async tx => {
      await tx.post.findUniqueOrThrow({ where: { id: postId } });
      return tx.postDonation.findMany({ where: { postId } });
    });
  }

  async create(postId: string, data: CreatePostDonationDto): Promise<PostDonationEntity> {
    return this.prismaService.postDonation.create({ data: { ...data, postId } });
  }

  async update(id: string, data: UpdatePostDonationDto): Promise<PostDonationEntity> {
    return this.prismaService.postDonation.update({ where: { id }, data });
  }

  async remove(id: string): Promise<PostDonationEntity> {
    return this.prismaService.postDonation.delete({ where: { id } });
  }
}
