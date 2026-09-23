'use client';

import { Suspense, useEffect, useRef } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

import { getGtmId, trackPageView } from '@/lib/gtm';

function GTMRouteListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialLoadRef = useRef(true);

  useEffect(() => {
    // Avoid double firing page_view on initial page load if handled by GTM container snippet
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const query = searchParams?.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;

    trackPageView({
      page_path: fullPath,
      page_title: typeof document !== 'undefined' ? document.title : '',
      page_location: typeof window !== 'undefined' ? window.location.href : '',
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleTagManager() {
  const gtmId = getGtmId();

  if (!gtmId) {
    return null;
  }

  return (
    <>
      {/* Google Tag Manager - noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="google-tag-manager-noscript"
        />
      </noscript>

      {/* Google Tag Manager - Main Container Script */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
        }}
      />

      {/* Track client-side route changes in Next.js App Router */}
      <Suspense fallback={null}>
        <GTMRouteListener />
      </Suspense>
    </>
  );
}
