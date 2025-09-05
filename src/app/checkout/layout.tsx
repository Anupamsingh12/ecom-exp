"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.replace('/auth/signin');
        }
      } catch (error) {
        router.replace('/auth/signin');
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
