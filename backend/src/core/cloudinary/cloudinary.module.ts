import { Module } from '@nestjs/common';
import CloudinaryConfiguration from './cloudinary.config';
import { CloudinaryService } from './cloudinary.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CloudinaryConfiguration, CloudinaryService],
  exports: [CloudinaryConfiguration, CloudinaryService],
})
export class CloudinaryModule {}
