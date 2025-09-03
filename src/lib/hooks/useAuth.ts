"use client";

import { removeItem, setItem } from '../localStorageControl';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCredentials, clearCredentials } from '../features/auth/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const signIn = (token: string) => {
    setItem('accessToken', token);
    dispatch(setCredentials(token));
  };

  const signOut = () => {
    removeItem('accessToken');
    dispatch(clearCredentials());
    router.push('/auth/signin');
  };

  return {
    isAuthenticated,
    signIn,
    signOut
  };
}
