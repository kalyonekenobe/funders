import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { PostDonationController } from './post-donation.controller';
import { PostDonationService } from './post-donation.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostDonationController],
  providers: [PostDonationService],
  exports: [PostDonationService],
})
export class PostDonationModule {}
