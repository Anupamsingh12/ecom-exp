"use client";

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '@/services/auth';
import { setCredentials } from '@/lib/features/auth/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        const user = await getCurrentUser();
        if (user) {
          dispatch(setCredentials(user));
        }
      } catch (error) {
        // User is not authenticated, but we won't redirect
        console.log('User not authenticated');
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize auth state
    initApp();
  }, [dispatch]);

  return children;
}
