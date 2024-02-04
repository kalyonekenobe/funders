import {
  DeleteApiResponse,
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse | DeleteApiResponse;

export interface IPrepareMultipleResourcesForUpload {
  resources: IUploadCloudinaryResource[];
  upload: (options?: UploadApiOptions) => Promise<CloudinaryResponse[]>;
}

export interface IPrepareSingleResourceForUpload {
  resource: IUploadCloudinaryResource;
  upload: (options?: UploadApiOptions) => Promise<CloudinaryResponse[]>;
}

export interface IPrepareMultipleResourcesForDelete {
  resources: IDeleteCloudinaryResource[];
  delete: () => Promise<CloudinaryResponse>;
}

export interface IPrepareSingleResourceForDelete {
  resource: IDeleteCloudinaryResource;
  delete: () => Promise<CloudinaryResponse>;
}

export interface IResourceToUploadOptions {
  mapping?: IFieldnameToFolderMapping;
  beforeUpload?: () => void;
  afterUpload?: () => void;
}

export interface IResourceToDeleteOptions {
  beforeDelete?: () => void;
  afterDelete?: () => void;
}

export type IUploadCloudinaryResource = Express.Multer.File & {
  publicId: string;
  resourceType: 'raw' | 'image' | 'video';
};

export interface IDeleteCloudinaryResource {
  publicId: string;
  resourceType: 'raw' | 'image' | 'video';
}

export interface ICloudinaryLikeResource {
  publicId: string;
  resourceType: string;
  [key: string | number]: any;
}

interface IFieldnameToFolderMapping {
  [fieldname: string]: string;
}
