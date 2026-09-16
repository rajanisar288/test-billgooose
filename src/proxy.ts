import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const siteMode = process.env.NEXT_PUBLIC_SITE_MODE ?? 'uat';

  /* =========================================================
     1. SHOWCASE MODE
     billgoose.com
     Only homepage is accessible
  ========================================================= */

  if (siteMode === 'PRODUCTION') {
    /*
     * Allow the homepage.
     */
    if (pathname === '/') {
      return createResponseWithSecurityHeaders();
    }

    /*
     * Any other application route goes back home.
     */
    url.pathname = '/';
    url.search = '';

    return NextResponse.redirect(url);
  }

  /* =========================================================
     2. UAT MODE
     Existing application behaviour remains enabled
  ========================================================= */

  /*
   * Redirect uppercase URLs to lowercase.
   */
  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();

    return NextResponse.redirect(url, 301);
  }

  /*
   * Add trailing slash consistency.
   */
  if (!pathname.includes('.') && !pathname.endsWith('/') && pathname.length > 1) {
    url.pathname = `${pathname}/`;

    return NextResponse.redirect(url, 301);
  }

  /*
   * Journey IDs are runtime values and cannot be generated during a static
   * export. Serve the reusable resume shell while preserving the browser URL.
   */
  if (/^\/journey\/[^/]+\/$/.test(pathname)) {
    url.pathname = '/journey/';

    const response = NextResponse.rewrite(url);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    addSecurityHeaders(response);

    return response;
  }

  /*
   * Journey/private pages:
   * noindex + no-cache.
   */
  const isJourney =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/steps') ||
    pathname.startsWith('/journey') ||
    pathname.startsWith('/compare') ||
    pathname.startsWith('/result') ||
    pathname.startsWith('/current-usage') ||
    pathname.startsWith('/review-your-details');

  if (isJourney) {
    const response = NextResponse.next();

    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');

    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

    response.headers.set('Pragma', 'no-cache');

    response.headers.set('Expires', '0');

    addSecurityHeaders(response);

    return response;
  }

  /*
   * Normal public pages.
   */
  return createResponseWithSecurityHeaders();
}

/* =========================================================
   SECURITY HELPERS
========================================================= */

function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');

  response.headers.set('X-Frame-Options', 'DENY');

  response.headers.set('X-XSS-Protection', '1; mode=block');

  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
}

function createResponseWithSecurityHeaders() {
  const response = NextResponse.next();

  addSecurityHeaders(response);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|css|js)$).*)',
  ],
};
