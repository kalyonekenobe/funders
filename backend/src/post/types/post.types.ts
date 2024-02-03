export interface PostRequestBodyFiles {
  attachments?: Express.Multer.File[];
  image?: Express.Multer.File[];
}

export interface RemovePostFilesOptions {
  image: boolean;
  attachments: boolean;
}
