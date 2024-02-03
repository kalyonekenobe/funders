export interface UserRequestBodyFiles {
  avatar?: Express.Multer.File[];
}

export interface RemoveUserFilesOptions {
  avatar: boolean;
}
