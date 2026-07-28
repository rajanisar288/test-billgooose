import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // 1. Redirect to lowercase URLs (prevents duplicate content)
  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  // 2. Add trailing slash consistency (SEO best practice)
  if (!pathname.includes('.') && !pathname.endsWith('/') && pathname.length > 1) {
    url.pathname = `${pathname}/`;
    return NextResponse.redirect(url, 301);
  }

  // 3. Journey pages - noindex and no-cache headers
  const isJourney =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/profile');

  if (isJourney) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // 4. Security headers for all pages
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
