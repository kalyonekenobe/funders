export const getFileExtension = (file: Express.Multer.File) =>
  /[.]/.exec(file.originalname) ? /[^.]+$/.exec(file.originalname) : '';
