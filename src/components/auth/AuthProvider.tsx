"use client";

import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { getCurrentUser } from '@/services/auth';
import { userAtom, isAuthenticatedAtom } from '@/app/store';
import { usePathname } from 'next/navigation';
import { getItem } from '@/lib/localStorageControl';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useSetAtom(userAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const pathname = usePathname();

  const checkAuthStatus = async () => {
    // Only check if we have a token
    const token = getItem('accessToken');
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('User not authenticated');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuthStatus();
  }, []); // Initial check

  // Check auth on route change
  useEffect(() => {
    if (!isLoading) { // Prevent double-checking on initial mount
      checkAuthStatus();
    }
  }, [pathname]); // Re-run when route changes

  if (isLoading) {
    return null; // or a loading spinner
  }

  return children;
}
