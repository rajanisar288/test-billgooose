import Link from 'next/link';

import { generateMarketingMetadata } from '@/lib/seo/metadata';

/**
 * Custom 404 Page
 * Features: Noindex, internal links, user-friendly message
 */
export const metadata = generateMarketingMetadata({
  title: 'Page Not Found',
  description:
    'The page you are looking for could not be found. Please check the URL or return to our homepage.',
  noIndex: true, // 404 pages should not be indexed
});

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or
          deleted.
        </p>
        {/* Internal link for SEO */}
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
