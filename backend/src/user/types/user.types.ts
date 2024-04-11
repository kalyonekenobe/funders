export interface UserRequestBodyFiles {
  avatar?: Express.Multer.File[];
}

export enum Permissions {
  MANAGE_POST_COMMENTS = 1,
  MANAGE_CHATS = 2,
  MANAGE_CHAT_MESSAGES = 4,
  MANAGE_POSTS = 8,
  MANAGE_POST_CATEGORIES = 16,
  MANAGE_USERS = 32,
  MANAGE_USER_BANS = 64,
}
