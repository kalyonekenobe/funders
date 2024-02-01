import {
  DeleteApiResponse,
  DeliveryType,
  ResourceType,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse | DeleteApiResponse;
export type CloudinaryDestroyOptions = {
  resource_type?: ResourceType;
  type?: DeliveryType;
  invalidate?: boolean;
};
