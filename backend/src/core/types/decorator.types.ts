export interface IUploadRestriction {
  fieldname: string;
  minFileSize?: number;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
}
