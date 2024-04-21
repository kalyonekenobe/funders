import { RegistrationMethod } from './registration-method.types';
import { UserRole } from './user-role.types';

export interface User {
  id: string;
  registrationMethod: RegistrationMethod;
  role: UserRole;
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
}
