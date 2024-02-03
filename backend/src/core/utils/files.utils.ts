import { CloudinaryResourceTypes } from '../constants/constants';

export const getFileExtension = (file: Express.Multer.File) =>
  /[.]/.exec(file.originalname) ? /[^.]+$/.exec(file.originalname) : '';

export const getCloudinaryResourceType = (file: Express.Multer.File) => {
  return (
    Object.keys(CloudinaryResourceTypes).find(key =>
      CloudinaryResourceTypes[key].includes(file.mimetype),
    ) ?? 'raw'
  );
};
