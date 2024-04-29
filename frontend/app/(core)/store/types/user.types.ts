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
