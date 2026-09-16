'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem('token');
  if (token) {
    return true;
  }

  return false;
}

export default function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authenticated = isUserAuthenticated();
    if (!authenticated) {
      // Hydrate browser-only usage data after the client mounts.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(false);
      router.replace(redirectTo);
    } else {
      setIsAuthenticated(true);
    }
  }, [router, redirectTo]);

  if (isAuthenticated === null || isAuthenticated === false) {
    return null;
  }

  return <>{children}</>;
}
