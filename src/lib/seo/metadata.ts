import type { Metadata } from 'next';

export interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  noIndex?: boolean;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://billgoose.com';
const SITE_NAME = 'Bill Goose';
const DEFAULT_IMAGE = '/og-image.jpg';

/**
 * Generate metadata for marketing pages (public, indexed)
 * Features: Unique titles, unique descriptions, canonical URLs, Open Graph, Twitter Cards
 */
export function generateMarketingMetadata({
  title,
  description,
  canonical,
  noIndex = false,
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
}: SeoProps): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = canonical || `${SITE_URL}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(tags && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    keywords: tags?.join(', '),
  };
}

/**
 * Generate metadata for journey pages (private, noindex)
 * Features: noindex, nofollow, noarchive
 */
export function generateJourneyMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}
