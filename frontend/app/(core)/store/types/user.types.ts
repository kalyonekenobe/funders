import { Following } from './following.types';
import { Post } from './post.types';
import {
  UserRegistrationMethod,
  UserRegistrationMethodEnum,
} from './user-registration-method.types';
import { UserRole, UserRoleEnum } from './user-role.types';

export interface User {
  id: string;
  registrationMethod: UserRegistrationMethodEnum;
  role: UserRoleEnum;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  phone: string | null;
  bio: string | null;
  avatar: string | null;
  refreshToken: string | null;
  stripeCustomerId: string;
  registeredAt: Date;
  userRegistrationMethod?: UserRegistrationMethod;
  userRole?: UserRole;
  followings?: Following[];
  followers?: Following[];
  bans?: any[];
  chats?: any[];
  messages?: any[];
  posts?: Post[];
  postReactions?: any[];
  donations?: any[];
  comments?: any[];
  commentReactions?: any[];
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
