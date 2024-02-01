import { Injectable } from '@nestjs/common';
import { CloudinaryDeleteResourcesPayload, CloudinaryResponse } from './cloudinary.types';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import { getFileExtension } from '../utils/files.utils';
import * as streamifier from 'streamifier';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File, options?: UploadApiOptions): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          ...options,
          resource_type: 'auto',
          filename_override: `${uuid()}.${getFileExtension(file)}`,
          use_filename: true,
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (result) {
            return resolve(result);
          }

          return reject('An error occured while uploading the file');
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }

  removeFiles(publicIds: CloudinaryDeleteResourcesPayload[]): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>(async (resolve, reject) => {
      const filesToDelete = publicIds.reduce(
        (previousValue, currentValue) => {
          if (!previousValue[currentValue.resource_type]) {
            previousValue[currentValue.resource_type] = [currentValue.public_id];
          } else {
            previousValue[currentValue.resource_type].push(currentValue.public_id);
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
