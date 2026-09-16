'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import FullPageLoader from '@/components/common/FullPageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('token_expiry');

  if (token) {
    if (tokenExpiry) {
      const expiryTime = Number(tokenExpiry);
      if (!isNaN(expiryTime) && Date.now() > expiryTime) {
        // Token has expired — perform automatic logout
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiry');
        sessionStorage.removeItem('billgooseSignedInUser');
        window.dispatchEvent(new Event('billgoose-auth-changed'));
        return false;
      }
    }
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(false);
      router.replace(redirectTo);
    } else {
      setIsAuthenticated(true);
    }
  }, [router, redirectTo]);

  if (isAuthenticated === null || isAuthenticated === false) {
    return <FullPageLoader message="Checking authentication..." />;
  }

  return <>{children}</>;
}
