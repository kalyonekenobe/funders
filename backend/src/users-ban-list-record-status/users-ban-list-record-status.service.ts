import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UsersBanListRecordStatusEntity } from './entities/users-ban-list-record-status.entity';
import { CreateUsersBanListRecordStatusDto } from './dto/create-users-ban-list-record-status.dto';
import { UpdateUsersBanListRecordStatusDto } from './dto/update-users-ban-list-record-status.dto';
import { UsersBanListRecordEntity } from 'src/users-ban-list-record/entities/users-ban-list-record.entity';

@Injectable()
export class UsersBanListRecordStatusService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<UsersBanListRecordStatusEntity[]> {
    return this.prismaService.usersBanListRecordStatus.findMany();
  }

  async findUsersBanListRecordsWithStatus(name: string): Promise<UsersBanListRecordEntity[]> {
    return (
      await this.prismaService.usersBanListRecordStatus.findUniqueOrThrow({
        where: { name },
        select: { usersBanListRecords: true },
      })
    ).usersBanListRecords;
  }

  async create(data: CreateUsersBanListRecordStatusDto): Promise<UsersBanListRecordStatusEntity> {
    return this.prismaService.usersBanListRecordStatus.create({ data });
  }

  async update(
    name: string,
    data: UpdateUsersBanListRecordStatusDto,
  ): Promise<UsersBanListRecordStatusEntity> {
    return this.prismaService.usersBanListRecordStatus.update({ where: { name }, data });
  }

  async remove(name: string) {
    return this.prismaService.usersBanListRecordStatus.delete({ where: { name } });
  }
}
