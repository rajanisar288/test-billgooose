import DashboardClient from '@/components/shared/journey/DashboardClient';
import { generateJourneyMetadata } from '@/lib/seo/metadata';

/**
 * Dashboard Page - Journey (Server Component)
 * Features: noindex metadata, server-rendered shell
 * EXCLUDED from sitemap
 */
export const metadata = generateJourneyMetadata(
  'Dashboard',
  'Manage your billing and subscription services',
);

export default function DashboardPage() {
  return <DashboardClient />;
}
