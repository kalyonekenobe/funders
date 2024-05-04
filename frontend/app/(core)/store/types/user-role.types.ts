import { User } from './user.types';

export enum UserRoleEnum {
  Default = 'Default',
  Volunteer = 'Volunteer',
  Administrator = 'Administrator',
}

export interface UserRole {
  name: UserRoleEnum;
  permissions: number;
  users?: User[];
}
