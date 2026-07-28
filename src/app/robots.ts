import { type MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://billgoose.com';

/**
 * Robots.txt - Controls crawler access
 * Features: Allows marketing pages, Disallows journey pages
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard', // Journey pages - not indexed
        '/onboarding', // Journey pages - not indexed
        '/profile', // Journey pages - not indexed
        '/api/', // API routes - not indexed
        '/_next/', // Next.js internal - not indexed
        '/_vercel/', // Vercel internal - not indexed
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
