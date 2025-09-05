"use client";

import { removeItem, setItem } from '../localStorageControl';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { userAtom, isAuthenticatedAtom } from '@/app/store';
import { User } from '@/types/user.types';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);

  const signIn = (userData: User, token: string) => {
    setItem('accessToken', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    removeItem('accessToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/signin');
  };

  return {
    isAuthenticated,
    user,
    signIn,
    signOut
  };
}
