import { generateJourneyMetadata } from '@/lib/seo/metadata';

/**
 * Journey Layout
 * Features: noindex, nofollow, noarchive (prevents indexing)
 * EXCLUDED from sitemap
 */
export const metadata = generateJourneyMetadata(
  'Dashboard',
  'Manage your billing and subscription services',
);

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Noindex is automatically applied via metadata */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center justify-between">
            <a
              href="/dashboard"
              className="text-xl font-bold text-blue-600"
            >
              Bill Goose
            </a>
            <ul className="flex space-x-4">
              <li>
                <a
                  href="/dashboard"
                  className="px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Profile
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
