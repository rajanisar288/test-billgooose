'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

interface SeoProps {
  children?: React.ReactNode;
  structuredData?: Record<string, unknown>;
}

/**
 * SEO Component - Injects structured data into the page
 * Features: JSON-LD structured data, conditional rendering for journey pages
 */
export default function Seo({ children, structuredData }: SeoProps) {
  const pathname = usePathname();

  // Check if it's a journey page (starts with /dashboard, /onboarding, /profile)
  const isJourney =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/onboarding') ||
    pathname?.startsWith('/profile');

  // Don't render structured data on journey pages (privacy)
  if (isJourney) {
    return <>{children}</>;
  }

  return (
    <>
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      {children}
    </>
  );
}
