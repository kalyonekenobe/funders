import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary.types';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File, options?: UploadApiOptions): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          return reject(error);
        }

        if (result) {
          return resolve(result);
        }

        return reject('An error occured while uploading the file');
      });

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }
}
