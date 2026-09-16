import JourneyAwareNotFound from '@/components/journey/journeyId/journey-aware-not-found';
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
  return <JourneyAwareNotFound />;
}
