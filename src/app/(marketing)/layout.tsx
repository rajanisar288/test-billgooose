import type { ReactNode } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Seo from '@/components/shared/seo';
import { generateMarketingMetadata } from '@/lib/seo/metadata';
import { generateOrganizationStructuredData } from '@/lib/seo/structured-data';

export const metadata = generateMarketingMetadata({
  title: 'Home',
  description:
    'Compare energy, broadband, mobile, insurance, credit cards and loans with trusted UK providers.',
});

type MarketingLayoutProps = Readonly<{
  children: ReactNode;
}>;

const compareLinks = [
  { label: 'Energy', href: '/energy' },
  { label: 'Broadband', href: '/broadband' },
  { label: 'Mobile', href: '/mobile', badge: 'New' },
  { label: 'Insurance', href: '/insurance' },
  { label: 'Credit Cards', href: '/credit-cards' },
  { label: 'Loans', href: '/loans' },
];

const companyLinks = [
  { label: 'About us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Press', href: '/press' },
  { label: 'Contact', href: '/contact' },
];

const supportLinks = [
  { label: 'Help Centre', href: '/help' },
  { label: 'Contact', href: '/contact' },
  { label: 'Accessibility', href: '/accessibility' },
];

const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Terms', href: '/terms' },
  { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
  { label: 'Editorial Policy', href: '/editorial-policy' },
];

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: Array<{
    label: string;
    href: string;
    badge?: string;
  }>;
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold text-secondary">{title}</h3>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex items-center gap-2 text-sm text-content-secondary transition-colors hover:text-primary"
            >
              {link.label}

              {link.badge ? <span className="badge badge-primary">{link.badge}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  const structuredData = generateOrganizationStructuredData();

  return (
    <Seo structuredData={structuredData}>
      <div className="flex min-h-screen flex-col bg-surface">
        <header className="sticky top-0 z-50 border-b border-border-light bg-white/95 backdrop-blur">
          <div className="app-container flex min-h-[72px] items-center justify-between gap-6">
            <Link
              href="/"
              aria-label="BillGoose homepage"
              className="shrink-0"
            >
              <Image
                src="/images/billgoose-logo.png"
                alt="BillGoose"
                width={172}
                height={50}
                priority
                className="h-auto w-[145px] sm:w-[170px]"
              />
            </Link>

            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-8 lg:flex"
            >
              <Link
                href="#compare"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary transition-colors hover:text-primary"
              >
                Compare
                <ChevronDownIcon />
              </Link>

              <Link
                href="#guides"
                className="text-sm font-medium text-secondary transition-colors hover:text-primary"
              >
                Guides
              </Link>

              <Link
                href="/help"
                className="text-sm font-medium text-secondary transition-colors hover:text-primary"
              >
                Help
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="btn btn-outline btn-sm gap-2"
              >
                <span className="hidden sm:inline">Sign In</span>

                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-white">
                  <UserIcon />
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border-light bg-white">
          <div className="app-container py-12 lg:py-16">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
              <div className="max-w-sm">
                <Link
                  href="/"
                  aria-label="BillGoose homepage"
                  className="inline-block"
                >
                  <Image
                    src="/images/billgoose-logo.png"
                    alt="BillGoose"
                    width={160}
                    height={46}
                    className="h-auto w-[150px]"
                  />
                </Link>

                <p className="mt-5 text-sm leading-6 text-content-secondary">
                  Compare household bills from trusted UK providers and find better-value deals in
                  one simple place.
                </p>
              </div>

              <FooterLinkGroup
                title="Compare"
                links={compareLinks}
              />

              <FooterLinkGroup
                title="Company"
                links={companyLinks}
              />

              <FooterLinkGroup
                title="Support"
                links={supportLinks}
              />

              <FooterLinkGroup
                title="Legal"
                links={legalLinks}
              />
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-border-light pt-7 text-sm text-content-muted sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} BillGoose Ltd. Registered in England &amp; Wales. All
                rights reserved.
              </p>

              <p>Compare. Manage. Save.</p>
            </div>
          </div>
        </footer>
      </div>
    </Seo>
  );
}
