const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://billgoose.com';

/**
 * Organization Structured Data - Appears in search results as knowledge panel
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bill Goose',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Streamline your billing and subscription management',
    sameAs: ['https://twitter.com/billgoose', 'https://linkedin.com/company/billgoose'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-555-0199',
      contactType: 'sales',
      availableLanguage: ['English'],
    },
  };
}

/**
 * Breadcrumb Structured Data - Shows navigation path in search results
 */
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Article Structured Data - Rich snippets for blog posts
 */
export function generateArticleStructuredData({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedTime: string;
  modifiedTime?: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bill Goose',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
  };
}

/**
 * FAQ Structured Data - FAQ rich results in search
 */
export function generateFaqStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
