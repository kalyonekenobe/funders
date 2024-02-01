import { Injectable } from '@nestjs/common';
import { CloudinaryDestroyOptions, CloudinaryResponse } from './cloudinary.types';
import { AdminAndResourceOptions, UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CloudinaryService {
  constructor(private readonly httpService: HttpService) {}

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

  removeFiles(
    publicIds: string[],
    options?: CloudinaryDestroyOptions,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>(async (resolve, reject) => {
      publicIds.forEach(id => {
        cloudinary.uploader.destroy(id, options, (error, result) => {
          console.log(id);
          if (error) {
            return reject(error);
          }

          if (result) {
            return resolve(result);
          }

          return reject('An error occured while deleting the list of files');
        });
      });
    });
  }
}
