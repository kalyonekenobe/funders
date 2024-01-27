import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './cloudinary.types';
import { AdminAndResourceOptions, UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

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

  removeFilesByUrls(urls: string[]): Promise<any> {
    return Promise.all(
      urls.map(url => {
        return firstValueFrom(this.httpService.delete(url));
      }),
    ).then(response => {
      console.log(response);
      return response;
    });
  }

  removeFiles(publicIds: string[], options?: AdminAndResourceOptions): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>(async (resolve, reject) => {
      cloudinary.api.delete_resources(publicIds, options, (error, result) => {
        if (error) {
          return reject(error);
        }

        if (result) {
          return resolve(result);
        }

        return reject('An error occured while deleting the list of files');
      });
    });
  }
}
