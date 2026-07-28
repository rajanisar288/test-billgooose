import { type MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://billgoose.com';

// Marketing pages only - EXCLUDE journey pages
const marketingPages = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: 'about', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: 'services', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: 'pricing', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: 'blog', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: 'contact', priority: 0.6, changeFrequency: 'monthly' as const },
];

// Blog posts would be fetched from CMS or content files
const blogPosts: { slug: string; date: string }[] = [
  // Example: { slug: 'getting-started-with-billing', date: '2024-01-15' },
];

/**
 * Sitemap - Only includes marketing pages
 * Features: Unique URLs, priorities, change frequencies
 * EXCLUDES: /dashboard, /onboarding, /profile
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = marketingPages.map((page) => ({
    url: `${SITE_URL}/${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
