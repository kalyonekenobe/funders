import { User } from './user.types';

export enum UserRegistrationMethodEnum {
  Default = 'Default',
  Google = 'Google',
  Discord = 'Discord',
  Apple = 'Apple',
}

export interface UserRegistrationMethod {
  name: UserRegistrationMethodEnum;
  users?: User[];
}
