import { DeleteApiResponse, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse | DeleteApiResponse;

export interface CloudinaryDeleteResourcesPayload {
  public_id: string;
  resource_type: string;
}
