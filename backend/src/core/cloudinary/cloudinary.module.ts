import { Module } from '@nestjs/common';
import CloudinaryConfiguration from './cloudinary.config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryConfiguration, CloudinaryService],
  exports: [CloudinaryConfiguration, CloudinaryService],
})
export class CloudinaryModule {}
