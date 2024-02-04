import { Injectable } from '@nestjs/common';
import {
  CloudinaryResponse,
  ICloudinaryLikeResource,
  IDeleteCloudinaryResource,
  IPrepareMultipleResourcesForDelete,
  IPrepareMultipleResourcesForUpload,
  IPrepareSingleResourceForDelete,
  IPrepareSingleResourceForUpload,
  IResourceToDeleteOptions,
  IResourceToUploadOptions,
  IUploadCloudinaryResource,
} from './cloudinary.types';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { CloudinaryResourceTypes } from '../constants/constants';
import { getFileExtension } from '../utils/files.utils';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CloudinaryService {
  private async upload(
    payload: IUploadCloudinaryResource,
    options?: UploadApiOptions,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          ...options,
          resource_type: payload.resourceType,
          public_id: payload.publicId,
          use_filename: true,
          unique_filename: false,
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

      streamifier.createReadStream(payload.buffer).pipe(stream);
    });
  }

  async delete(payload: IDeleteCloudinaryResource[]): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>(async (resolve, reject) => {
      const filesToDelete = payload.reduce(
        (previousValue, currentValue) => {
          if (!previousValue[currentValue.resourceType]) {
            previousValue[currentValue.resourceType] = [currentValue.publicId];
          } else {
            previousValue[currentValue.resourceType].push(currentValue.publicId);
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

  getResourceType(payload: Express.Multer.File): 'raw' | 'image' | 'video' {
    const types = Object.keys(CloudinaryResourceTypes) as ('raw' | 'image' | 'video')[];
    return types.find(type => CloudinaryResourceTypes[type].includes(payload.mimetype)) ?? 'raw';
  }

  prepareSingleResourceForUpload(
    payload: Express.Multer.File,
    options: IResourceToUploadOptions = {},
  ): IPrepareSingleResourceForUpload {
    const uploader = this.prepareMultipleResourcesForUpload([payload], options);
    return {
      resource: uploader.resources[0],
      upload: uploader.upload,
    };
  }

  prepareMultipleResourcesForUpload(
    payload: Express.Multer.File[],
    options: IResourceToUploadOptions = {},
  ): IPrepareMultipleResourcesForUpload {
    const resources: IUploadCloudinaryResource[] = payload.map(resource => {
      const folder = options.mapping ? `${options.mapping[resource.fieldname]}/` ?? '' : '';
      const filename = `${uuid()}.${getFileExtension(resource)}`;
      const publicId = `${folder}${filename}`;
      const resourceType = this.getResourceType(resource);

      return {
        ...resource,
        publicId,
        resourceType,
      };
    });

    return {
      resources,
      upload: async (uploadApiOptions?: UploadApiOptions): Promise<CloudinaryResponse[]> => {
        if (options.beforeUpload) {
          options.beforeUpload();
        }

        const result = this.uploadMultipleResources(resources, uploadApiOptions);

        if (options.afterUpload) {
          return result.then(async response => {
            options.afterUpload?.();
            return response;
          });
        }

        return result;
      },
    };
  }

  prepareSingleResourceForDelete(
    payload: ICloudinaryLikeResource,
    options: IResourceToDeleteOptions = {},
  ): IPrepareSingleResourceForDelete {
    const destroyer = this.prepareMultipleResourcesForDelete([payload], options);
    return {
      resource: destroyer.resources[0],
      delete: destroyer.delete,
    };
  }

  prepareMultipleResourcesForDelete(
    payload: ICloudinaryLikeResource[],
    options: IResourceToDeleteOptions = {},
  ): IPrepareMultipleResourcesForDelete {
    const resources = payload.map(
      ({ publicId, resourceType }) => ({ publicId, resourceType }) as IDeleteCloudinaryResource,
    );
    return {
      resources,
      delete: async (): Promise<CloudinaryResponse> => {
        if (options.beforeDelete) {
          options.beforeDelete();
        }

        const result = this.deleteMultipleResources(resources);

        if (options.afterDelete) {
          return result.then(response => {
            options.afterDelete?.();
            return response;
          });
        }

        return result;
      },
    };
  }

  async uploadSingleResource(
    payload: IUploadCloudinaryResource,
    options?: UploadApiOptions,
  ): Promise<CloudinaryResponse> {
    return this.upload(payload, options);
  }

  async uploadMultipleResources(
    payload: IUploadCloudinaryResource[],
    options?: UploadApiOptions,
  ): Promise<CloudinaryResponse[]> {
    return Promise.all(payload.map(resource => this.upload(resource, options)));
  }

  async deleteSingleResource(payload: IDeleteCloudinaryResource): Promise<CloudinaryResponse> {
    return this.delete([payload]);
  }

  async deleteMultipleResources(payload: IDeleteCloudinaryResource[]): Promise<CloudinaryResponse> {
    return this.delete(payload);
  }
}
