'use client';

import { useEffect, useState } from 'react';
import { User } from '../store/types/user.types';
import { getAuthenticatedUser } from '../actions/auth.actions';
import {
  signOut as signOutServerAction,
  signIn as signInServerAction,
  signUp as signUpServerAction,
} from '../actions/auth.actions';

export const useAuth = () => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

  useEffect(() => {
    const request = async () => {
      setAuthenticatedUser(await fetchAuthenticatedUser());
    };

    request().catch(console.error);
  }, []);

  const fetchAuthenticatedUser = async () => {
    return getAuthenticatedUser();
  };

  const signIn = async (state: any, formData: FormData) => signInServerAction(state, formData);
  const signUp = async (state: any, formData: FormData) => signUpServerAction(state, formData);
  const signOut = async () => signOutServerAction();

  return { authenticatedUser, fetchAuthenticatedUser, signIn, signUp, signOut };
};
