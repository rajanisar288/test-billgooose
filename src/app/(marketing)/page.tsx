import type { ReactNode } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { generateMarketingMetadata } from '@/lib/seo/metadata';

export const metadata = generateMarketingMetadata({
  title: 'Compare Household Bills',
  description:
    'Compare energy, broadband, mobile, insurance, credit cards and loans with trusted UK providers.',
  canonical: 'https://billgoose.com',
});

type IconName =
  | 'energy'
  | 'broadband'
  | 'mobile'
  | 'insurance'
  | 'credit-card'
  | 'loan'
  | 'search'
  | 'details'
  | 'compare'
  | 'save'
  | 'shield'
  | 'lock'
  | 'eye'
  | 'wallet'
  | 'document';

type IconProps = Readonly<{
  name: IconName;
  className?: string;
}>;

const comparisonCategories: Array<{
  title: string;
  description: string;
  href: string;
  icon: IconName;
}> = [
  {
    title: 'Energy',
    description: 'Fast switching, fixed and variable tariffs',
    href: '/energy',
    icon: 'energy',
  },
  {
    title: 'Broadband',
    description: 'Fast fibre deals from top UK providers',
    href: '/broadband',
    icon: 'broadband',
  },
  {
    title: 'Mobile',
    description: 'Latest SIM-only and mobile contract deals',
    href: '/mobile',
    icon: 'mobile',
  },
  {
    title: 'Insurance',
    description: 'Car, home, travel and pet insurance cover',
    href: '/insurance',
    icon: 'insurance',
  },
  {
    title: 'Credit Cards',
    description: '0% balance transfer and rewards cards',
    href: '/credit-cards',
    icon: 'credit-card',
  },
  {
    title: 'Loans',
    description: 'Compare personal loans up to £25,000',
    href: '/loans',
    icon: 'loan',
  },
];

const providers = [
  {
    name: 'British Gas',
    image: '/images/provider-british-gas.png',
  },
  {
    name: 'Octopus Energy',
    image: '/images/provider-octopus.png',
  },
  {
    name: 'E.ON Energy',
    image: '/images/provider-eon.png',
  },
  {
    name: 'Vodafone',
    image: '/images/provider-vodafone.png',
  },
  {
    name: 'Aviva',
    image: '/images/provider-aviva.png',
  },
  {
    name: 'Confused.com',
    image: '/images/provider-confused.png',
  },
];

const benefits = [
  {
    title: 'Compare Hundreds of Deals',
    description:
      'One search shows tariffs, contracts and offers from trusted UK providers without jumping between sites.',
    image: '/images/compare-deals.png',
  },
  {
    title: 'Save Time & Money',
    description:
      'Households can compare better-value options quickly. BillGoose is free to use with no hidden fees.',
    image: '/images/save-money.png',
  },
  {
    title: 'Simple & Secure',
    description:
      'Clear sponsored labels, secure data handling and straightforward comparisons designed around you.',
    image: '/images/simple-secure.png',
  },
];

const steps: Array<{
  number: string;
  title: string;
  description: string;
  icon: IconName;
}> = [
  {
    number: '1',
    title: 'Choose a category',
    description: 'Pick from energy, broadband, mobile, insurance, credit cards or loans.',
    icon: 'search',
  },
  {
    number: '2',
    title: 'Enter your details',
    description: 'Enter your postcode and answer a few simple questions about what you need.',
    icon: 'details',
  },
  {
    number: '3',
    title: 'Compare offers',
    description: 'View personalised deals side by side, including savings and key features.',
    icon: 'compare',
  },
  {
    number: '4',
    title: 'Switch & save',
    description: 'Choose the option that works for you and continue with the selected provider.',
    icon: 'save',
  },
];

const guides = [
  {
    category: 'Energy',
    duration: '6 min read',
    title: '10 ways to reduce your energy bills this winter',
    href: '/guides/reduce-energy-bills',
    image: '/images/guide-energy.jpg',
  },
  {
    category: 'Broadband',
    duration: '8 min read',
    title: 'Best UK broadband providers of 2026',
    href: '/guides/best-broadband-providers',
    image: '/images/guide-broadband.jpg',
  },
  {
    category: 'Credit',
    duration: '5 min read',
    title: 'How to improve your credit score in 90 days',
    href: '/guides/improve-credit-score',
    image: '/images/guide-credit.jpg',
  },
  {
    category: 'Insurance',
    duration: '10 min read',
    title: 'The complete insurance buying guide',
    href: '/guides/insurance-buying-guide',
    image: '/images/guide-insurance.jpg',
  },
];

const reviews = [
  {
    text: 'Switched my energy in under five minutes and found a much better-value deal. The experience was clear from start to finish.',
    initials: 'JF',
    name: 'Jaylon Franci',
    city: 'Manchester',
    saved: '£612',
  },
  {
    text: 'Compared broadband and mobile in one place. The sponsored labels were clear and made the results easier to understand.',
    initials: 'AM',
    name: 'Alfonso Madsen',
    city: 'London',
    saved: '£340',
  },
  {
    text: 'Found a better car insurance renewal without unwanted calls or a complicated process. Everything was simple.',
    initials: 'RS',
    name: 'Ryan Stanton',
    city: 'Birmingham',
    saved: '£210',
  },
];

const trustItems: Array<{
  title: string;
  description: string;
  icon: IconName;
}> = [
  {
    title: 'Independent comparison',
    description:
      'We help you understand the available market, not only the providers that pay the most.',
    icon: 'compare',
  },
  {
    title: 'Clear sponsored labels',
    description:
      'Sponsored placements are clearly identified so you know exactly what you are viewing.',
    icon: 'eye',
  },
  {
    title: 'Secure data handling',
    description:
      'Your details are handled securely using appropriate data protection and security controls.',
    icon: 'lock',
  },
  {
    title: 'Privacy controls',
    description: 'You stay in control of the information you provide and how it is used.',
    icon: 'shield',
  },
  {
    title: 'No hidden fees',
    description:
      'BillGoose is free for households. Any commercial relationships are disclosed clearly.',
    icon: 'wallet',
  },
  {
    title: 'Editorial standards',
    description:
      'Our guides are written and reviewed to keep information useful, clear and accurate.',
    icon: 'document',
  },
];

function Icon({ name, className = 'size-6' }: IconProps) {
  const commonProps = {
    'aria-hidden': true,
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
  };

  switch (name) {
    case 'energy':
      return (
        <svg {...commonProps}>
          <path
            d="m13 2-8 12h6l-1 8 9-13h-6V2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'broadband':
      return (
        <svg {...commonProps}>
          <path
            d="M4 9a12 12 0 0 1 16 0M7 12a8 8 0 0 1 10 0m-7 4a3 3 0 0 1 4 0M12 20h.01"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'mobile':
      return (
        <svg {...commonProps}>
          <rect
            x="7"
            y="2"
            width="10"
            height="20"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M10 5h4m-3 14h2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'insurance':
      return (
        <svg {...commonProps}>
          <path
            d="M12 3 4.5 6v5.5c0 4.6 3.1 7.8 7.5 9.5 4.4-1.7 7.5-4.9 7.5-9.5V6L12 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="m9 12 2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'credit-card':
      return (
        <svg {...commonProps}>
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M3 9h18M7 15h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'loan':
    case 'wallet':
      return (
        <svg {...commonProps}>
          <path
            d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a2 2 0 0 1 2 2v12H6a2 2 0 0 1-2-2V7.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M4 8h14.5A1.5 1.5 0 0 1 20 9.5v5H15a2.5 2.5 0 0 1 0-5h5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );

    case 'search':
      return (
        <svg {...commonProps}>
          <circle
            cx="11"
            cy="11"
            r="7"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m16 16 5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'details':
      return (
        <svg {...commonProps}>
          <path
            d="M4 5h16M4 12h16M4 19h10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle
            cx="7"
            cy="5"
            r="1.5"
            fill="currentColor"
          />
        </svg>
      );

    case 'compare':
      return (
        <svg {...commonProps}>
          <path
            d="M7 4v15m0 0-3-3m3 3 3-3M17 20V5m0 0-3 3m3-3 3 3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'save':
      return (
        <svg {...commonProps}>
          <path
            d="M5 4h14v16H5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8 4v6h8V4M8 20v-6h8v6"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );

    case 'shield':
      return (
        <svg {...commonProps}>
          <path
            d="M12 3 5 6v5c0 4.4 2.8 7.5 7 9 4.2-1.5 7-4.6 7-9V6l-7-3Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );

    case 'lock':
      return (
        <svg {...commonProps}>
          <rect
            x="5"
            y="10"
            width="14"
            height="11"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M8 10V7a4 4 0 0 1 8 0v3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );

    case 'eye':
      return (
        <svg {...commonProps}>
          <path
            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="12"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );

    case 'document':
      return (
        <svg {...commonProps}>
          <path
            d="M6 3h8l4 4v14H6V3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M14 3v5h5M9 13h6M9 17h6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      aria-hidden="true"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="m12 2.7 2.85 5.78 6.38.93-4.62 4.5 1.09 6.36L12 17.27l-5.7 3 1.09-6.36-4.62-4.5 6.38-.93L12 2.7Z" />
    </svg>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}

        <h2 className="section-title">{title}</h2>

        {description ? (
          <p className="mt-3 max-w-xl text-base leading-7 text-content-secondary">{description}</p>
        ) : null}
      </div>

      {action}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary-soft">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(7,153,138,0.13),transparent_36%)]" />

        <div className="app-container relative grid min-h-[600px] items-center gap-12 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="relative z-10">
            <p className="section-eyebrow">Compare. Manage. Save.</p>

            <h1 className="max-w-[720px] text-[clamp(2.8rem,5.8vw,5rem)] font-extrabold leading-[0.96] tracking-[-0.055em] text-secondary">
              Compare Household Bills Without the Wild Goose Chase
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-content-secondary">
              Save money across energy, broadband, mobile, insurance, credit cards and loans with
              trusted UK price comparisons.
            </p>

            <form
              action="/energy"
              method="get"
              className="mt-8 max-w-2xl rounded-[22px] border border-border-light bg-white p-3 shadow-floating"
            >
              <label
                htmlFor="hero-postcode"
                className="sr-only"
              >
                Enter your postcode
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="hero-postcode"
                  name="postcode"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="Enter your postcode"
                  className="form-control min-h-14 flex-1 border-0 bg-surface-subtle shadow-none"
                />

                <button
                  type="submit"
                  className="btn btn-primary btn-lg shrink-0 px-7"
                >
                  Find energy deals
                  <ArrowRightIcon />
                </button>
              </div>

              <div className="mt-3 grid gap-2 px-2 pb-1 text-xs text-content-secondary sm:grid-cols-2 lg:grid-cols-4">
                {[
                  'Free comparison',
                  'No obligation',
                  'Trusted UK providers',
                  'Secure & private',
                ].map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5"
                  >
                    <span className="text-primary">
                      <CheckIcon />
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            </form>
          </div>

          <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[500px]">
            <div className="absolute size-[370px] rounded-full border border-primary/10 sm:size-[470px]" />
            <div className="absolute size-[290px] rounded-full border border-primary/15 sm:size-[380px]" />

            <span className="absolute left-[8%] top-[26%] flex size-16 items-center justify-center rounded-full border border-border-light bg-white text-accent shadow-md">
              <Icon
                name="energy"
                className="size-8"
              />
            </span>

            <span className="absolute right-[5%] top-[15%] flex size-14 items-center justify-center rounded-full border border-border-light bg-white text-primary shadow-md">
              <Icon
                name="mobile"
                className="size-7"
              />
            </span>

            <span className="absolute bottom-[18%] right-[2%] flex size-16 items-center justify-center rounded-full border border-border-light bg-white text-primary shadow-md">
              <Icon
                name="insurance"
                className="size-8"
              />
            </span>

            <Image
              src="/images/hero-mascot.png"
              alt="BillGoose mascot"
              width={560}
              height={560}
              priority
              className="relative z-10 h-auto w-full max-w-[520px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="border-y border-border-light bg-white">
        <div className="app-container py-8">
          <p className="mb-7 text-center text-sm font-medium text-content-muted">
            Trusted by thousands of UK households · Comparing deals from
          </p>

          <div className="grid grid-cols-2 items-center gap-7 sm:grid-cols-3 lg:grid-cols-6">
            {providers.map((provider) => (
              <div
                key={provider.name}
                className="flex min-h-12 items-center justify-center"
              >
                <Image
                  src={provider.image}
                  alt={provider.name}
                  width={140}
                  height={48}
                  className="max-h-10 w-auto max-w-[125px] object-contain grayscale transition duration-200 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare categories */}
      <section
        id="compare"
        className="app-section bg-white"
      >
        <div className="app-container">
          <div className="section-header">
            <p className="section-eyebrow">Compare</p>

            <h2 className="section-title">Compare everything in one place</h2>

            <p className="section-description">
              Six essential household comparisons with the trusted UK providers you already know.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {comparisonCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="card card-interactive group flex min-h-[175px] flex-col p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Icon
                      name={category.icon}
                      className="size-6"
                    />
                  </span>

                  <span className="text-content-muted transition-transform group-hover:translate-x-1 group-hover:text-primary">
                    <ArrowRightIcon />
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold text-secondary">{category.title}</h3>

                <p className="mt-2 text-sm leading-6 text-content-secondary">
                  {category.description}
                </p>

                <span className="mt-auto pt-5 text-sm font-bold text-primary">Compare now</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-3 py-5 sm:px-5">
        <div className="app-container overflow-hidden rounded-[32px] bg-secondary px-5 py-14 text-white sm:px-8 lg:px-12 lg:py-16">
          <div className="section-header mb-10 lg:mb-12">
            <p className="section-eyebrow justify-center text-primary-light">Why BillGoose</p>

            <h2 className="text-white">Why thousands of UK households choose us</h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/70">
              Independent, transparent and refreshingly simple.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="overflow-hidden rounded-[22px] bg-white p-4 text-secondary"
              >
                <div className="flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-primary-soft">
                  <Image
                    src={benefit.image}
                    alt=""
                    width={380}
                    height={220}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="px-2 pb-3 pt-6 text-center">
                  <h3 className="text-xl font-bold text-secondary">{benefit.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-content-secondary">
                    {benefit.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="app-section bg-white">
        <div className="app-container">
          <div className="section-header">
            <p className="section-eyebrow">How it works</p>
            <h2 className="section-title">Save on your bills in four steps</h2>
          </div>

          <div className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-7 hidden border-t border-dashed border-primary/30 lg:block" />

            {steps.map((step) => (
              <article
                key={step.number}
                className="relative text-center"
              >
                <span className="relative z-10 mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-lg font-bold text-white shadow-md">
                  {step.number}
                </span>

                <div className="mt-7 flex min-h-[120px] items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <Icon
                    name={step.icon}
                    className="size-12"
                  />
                </div>

                <h3 className="mt-5 text-lg font-bold text-secondary">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-content-secondary">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section
        id="guides"
        className="app-section rounded-[36px] bg-primary-soft"
      >
        <div className="app-container">
          <SectionHeader
            eyebrow="Guides"
            title="Money advice from the flock"
            description="Impartial UK guides written to help you understand household bills, compare options and make informed decisions."
            action={
              <Link
                href="/guides"
                className="btn btn-outline"
              >
                All guides
                <ArrowRightIcon />
              </Link>
            }
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide) => (
              <article
                key={guide.title}
                className="card card-interactive group overflow-hidden"
              >
                <Link
                  href={guide.href}
                  className="block"
                >
                  <div className="h-48 overflow-hidden bg-surface-muted">
                    <Image
                      src={guide.image}
                      alt=""
                      width={480}
                      height={300}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className="text-primary">{guide.category}</span>
                      <span className="text-content-muted">•</span>
                      <span className="text-content-muted">{guide.duration}</span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold leading-6 text-secondary">
                      {guide.title}
                    </h3>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                      Read guide
                      <ArrowRightIcon />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="app-section bg-white">
        <div className="app-container">
          <div className="section-header">
            <p className="section-eyebrow">Reviews</p>

            <h2 className="section-title">Loved by UK households</h2>

            <p className="section-description">
              Real experiences from people comparing household services through BillGoose.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="card p-6 lg:p-7"
              >
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} />
                  ))}
                </div>

                <blockquote className="mt-5 min-h-[110px] text-base leading-7 text-content-secondary">
                  “{review.text}”
                </blockquote>

                <div className="mt-7 flex items-center justify-between gap-4 border-t border-border-light pt-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                      {review.initials}
                    </span>

                    <div>
                      <p className="font-bold text-secondary">{review.name}</p>
                      <p className="text-sm text-content-muted">{review.city}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-content-muted">
                      Saved
                    </p>
                    <p className="text-xl font-extrabold text-primary">{review.saved}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="app-section bg-surface-subtle">
        <div className="app-container">
          <div className="section-header">
            <p className="section-eyebrow">Trust & transparency</p>

            <h2 className="section-title">Built on trust, because it’s your money</h2>
          </div>

          <div className="grid gap-x-10 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((item) => (
              <article
                key={item.title}
                className="flex gap-4 border-b border-border-light py-6"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Icon
                    name={item.icon}
                    className="size-5"
                  />
                </span>

                <div>
                  <h3 className="text-base font-bold text-secondary">{item.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-content-secondary">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison CTA */}
      <section className="bg-white py-6">
        <div className="app-container relative overflow-hidden rounded-[30px] bg-gradient-to-r from-secondary to-primary px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.18),transparent_30%)]" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1fr_0.7fr]">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-white/70">
                Start comparing today
              </p>

              <h2 className="mt-3 text-white">Easily compare household bills</h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
                Quickly compare household services to find suitable deals and manage your bills more
                confidently.
              </p>

              <form
                action="/energy"
                method="get"
                className="mt-7 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-2 sm:flex-row"
              >
                <label
                  htmlFor="cta-postcode"
                  className="sr-only"
                >
                  Enter your postcode
                </label>

                <input
                  id="cta-postcode"
                  name="postcode"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="Enter your postcode"
                  className="min-h-12 flex-1 rounded-xl border-0 px-4 text-secondary outline-none"
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Find energy deals
                  <ArrowRightIcon />
                </button>
              </form>
            </div>

            <div className="relative hidden min-h-[250px] lg:block">
              <Image
                src="/images/comparison-mascot.png"
                alt="BillGoose mascot"
                fill
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-info-light py-10">
        <div className="app-container flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-secondary">Never miss a better deal</h2>

            <p className="mt-2 text-sm leading-6 text-content-secondary">
              Monthly savings tips, price alerts and UK bill guides delivered directly to your
              inbox.
            </p>
          </div>

          <form
            action="/newsletter"
            method="post"
            className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <label
              htmlFor="newsletter-email"
              className="sr-only"
            >
              Enter your email
            </label>

            <div className="flex-1">
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                className="form-control bg-white"
              />

              <p className="mt-2 pl-2 text-xs text-content-muted">
                No spam. Unsubscribe at any time.
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary min-h-12 self-start px-7"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
