import { Injectable } from '@nestjs/common';
import { CloudinaryDeleteResourcesPayload, CloudinaryResponse } from './cloudinary.types';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
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

  removeFiles(publicIds: CloudinaryDeleteResourcesPayload[]): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>(async (resolve, reject) => {
      const filesToDelete = publicIds.reduce(
        (previousValue, currentValue) => {
          if (!previousValue[currentValue.resourse_type]) {
            previousValue[currentValue.resourse_type] = [currentValue.public_id];
          } else {
            previousValue[currentValue.resourse_type].push(currentValue.public_id);
          }

          return previousValue;
        },
        {} as { [key: string]: string[] },
      );

      Object.entries(filesToDelete).forEach(([key, value]) => {
        if ((key === 'raw' || key === 'image' || key === 'video') && value?.length > 0) {
          cloudinary.api.delete_resources(value, { resource_type: key }, (error, result) => {
            if (error) {
              return reject(error);
            }

            if (result) {
              return resolve(result);
            }

            return reject('An error occured while deleting the list of files');
          });
        }
      });
    });
  }
}
