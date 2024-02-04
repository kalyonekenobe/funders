export const getFileExtension = (file: Express.Multer.File): unknown =>
  /[.]/.exec(file.originalname) ? /[^.]+$/.exec(file.originalname) : '';
