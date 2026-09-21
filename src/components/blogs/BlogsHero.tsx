'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, ChevronRight, Clock3, Plus, Search } from 'lucide-react';

import data from '@/data/content.json';

/* =========================================================
   16 BLOG CARDS — one per guide in guidePages
   Images still cycle through the original 4 guide images.
========================================================= */
const BLOG_CARDS = [
  {
    post: 1,
    category: 'Broadband',
    readTime: '7 min read',
    title: 'Are Broadband, TV and Mobile Bundles Really Cheaper?',
  },
  {
    post: 2,
    category: 'Energy',
    readTime: '8 min read',
    title: 'When Is the Best Time to Switch Energy Supplier?',
  },
  {
    post: 3,
    category: 'Broadband',
    readTime: '8 min read',
    title: 'Broadband Contract Ending? Your Step-by-Step Switching Checklist',
  },
  {
    post: 4,
    category: 'Credit Cards',
    readTime: '8 min read',
    title: 'Credit Card APR Explained Without the Jargon',
  },
  {
    post: 5,
    category: 'Energy',
    readTime: '8 min read',
    title: 'Fixed vs Variable Energy Tariffs: Which Is Better for You?',
  },
  {
    post: 6,
    category: 'Insurance',
    readTime: '8 min read',
    title: 'Home Insurance Explained: Buildings, Contents and Combined Cover',
  },
  {
    post: 7,
    category: 'Broadband',
    readTime: '8 min read',
    title: 'How Much Broadband Speed Do You Really Need?',
  },
  {
    post: 8,
    category: 'Mobile',
    readTime: '8 min read',
    title: 'How to Choose the Right Mobile Data Allowance',
  },
  {
    post: 9,
    category: 'Car Insurance',
    readTime: '8 min read',
    title: 'How to Compare Car Insurance Without Choosing the Wrong Cover',
  },
  {
    post: 10,
    category: 'Energy',
    readTime: '8 min read',
    title: 'How to Compare Energy Deals Without Getting Confused',
  },
  {
    post: 11,
    category: 'Energy',
    readTime: '8 min read',
    title: 'How to Read Your Energy Bill in Plain English',
  },
  {
    post: 12,
    category: 'Car Insurance',
    readTime: '8 min read',
    title: 'How to Reduce Your Car Insurance Premium Legally',
  },
  {
    post: 13,
    category: 'Pet Insurance',
    readTime: '8 min read',
    title: "Pet Insurance Explained: What Is and Isn't Usually Covered?",
  },
  {
    post: 14,
    category: 'Mobile',
    readTime: '8 min read',
    title: 'SIM-Only vs Phone Contract: Which Offers Better Value?',
  },
  {
    post: 15,
    category: 'Car Insurance',
    readTime: '8 min read',
    title: 'What Information Do You Need for a Car Insurance Quote?',
  },
  {
    post: 16,
    category: 'Energy',
    readTime: '8 min read',
    title: 'What to Do If Your Energy Deal Is Ending Soon',
  },
];

/* Original four images, cycled through the 16 cards */
const GUIDE_IMAGES = [
  { src: '/images/guide-1.png', alt: 'Warm home interior during winter' },
  { src: '/images/guide-2.png', alt: 'Broadband router and network cables' },
  { src: '/images/guide-3.png', alt: 'Person using a credit card and mobile phone' },
  { src: '/images/guide-4.png', alt: 'Electric car parked outside a home' },
];

export default function BlogsHero() {
  const { blogsPage } = data;

  const [searchQuery, setSearchQuery] = useState('');
  const [showNoMoreData, setShowNoMoreData] = useState(false);

  const allGuides = BLOG_CARDS.map((card, index) => {
    const image = GUIDE_IMAGES[index % GUIDE_IMAGES.length];

    return {
      ...card,
      instanceId: `blog-card-${card.post}`,
      href: `/guides?post=${card.post}`,
      linkText: 'Read Guide',
      image: image.src,
      imageAlt: image.alt,
    };
  });

  const query = searchQuery.trim().toLowerCase();

  const visibleGuides = query
    ? allGuides.filter((guide) =>
        [guide.title, guide.category, guide.readTime].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
    : allGuides;

  function handleSearch(value: string) {
    setSearchQuery(value);
    setShowNoMoreData(false);
  }

  return (
    <section
      className="
        w-full bg-white
        px-3 pb-[70px] pt-5
        sm:px-5 sm:pb-[80px] sm:pt-7
        md:px-6 md:pb-[90px] md:pt-9
        lg:px-8 lg:pb-[100px] lg:pt-10
      "
    >
      <div className="relative mx-auto w-full max-w-[1320px]">
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-x-0 top-0
            h-[420px]
            overflow-hidden rounded-[20px]
            bg-[linear-gradient(180deg,rgba(0,168,149,0.5)_0%,rgba(0,168,149,0)_100%)]
            p-px

            sm:h-[460px] sm:rounded-[24px]
            md:h-[500px] md:rounded-[28px]
            lg:h-[526px] lg:rounded-[30px]
          "
        >
          <div
            className="
              h-full w-full rounded-[19px]
              bg-[linear-gradient(180deg,#EEFFFB_0%,rgba(238,255,251,0)_100.01%)]

              sm:rounded-[23px]
              md:rounded-[27px]
              lg:rounded-[29px]
            "
          />
        </div>

        <div className="relative z-10">
          <div
            className="
              flex flex-col items-center
              px-4 pt-8 text-center

              sm:px-6 sm:pt-10
              md:px-8 md:pt-11
              lg:px-[52px] lg:pt-[44px]
            "
          >
            <span
              className="
                inline-flex min-h-[26px]
                items-center justify-center
                rounded-full bg-[#E6F5F2] px-3

                font-inter text-[11px] font-semibold
                leading-[20px] text-[#00897B]

                sm:text-[12px]
                lg:min-h-[30px] lg:text-[14px]
              "
            >
              {blogsPage.badge.label}
            </span>

            <h1
              className="
                mt-3
                font-red-hat-display font-[645]
                text-[30px] leading-[38px]
                tracking-[-0.02em] text-[#0C3354]

                sm:text-[36px] sm:leading-[44px]
                md:text-[42px] md:leading-[52px]
                lg:text-[48px] lg:leading-[60px]
              "
            >
              {blogsPage.heading}
            </h1>

            <nav
              aria-label="Breadcrumb"
              className="
                mt-2 flex items-center justify-center gap-2
                font-red-hat-display font-[467]
                text-[13px] leading-none text-[#0C3354]

                sm:text-[14px]
                md:text-[16px]
                lg:text-[18px]
              "
            >
              <Link
                href={blogsPage.breadcrumb.home.href}
                className="
                  underline decoration-[1px]
                  underline-offset-[3px]
                  transition-colors hover:text-[#00897B]
                "
              >
                {blogsPage.breadcrumb.home.label}
              </Link>

              <ChevronRight
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>{blogsPage.breadcrumb.current}</span>
            </nav>

            <div
              className="
                mt-6 flex h-[46px] w-full max-w-[300px]
                items-center gap-2 rounded-full
                border border-[#D0D5DD] bg-white px-4
                shadow-[0px_1px_2px_rgba(16,24,40,0.04)]

                sm:mt-7 sm:max-w-[320px]
                lg:mt-8 lg:max-w-[350px]
              "
            >
              <Search
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
                className="shrink-0 text-[#667085]"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder={blogsPage.search.placeholder}
                aria-label={blogsPage.search.ariaLabel}
                className="
                  h-full w-full min-w-0 bg-transparent
                  font-red-hat-display text-[14px]
                  font-[467] leading-5 text-[#0C3354]
                  placeholder:text-[#667085] outline-none
                "
              />
            </div>
          </div>

          <div
            className="
              mx-auto mt-[52px]
              grid w-full max-w-[1192px]
              grid-cols-1 gap-5 px-4

              sm:mt-[60px] sm:grid-cols-2 sm:px-6
              md:mt-[70px] md:px-8
              lg:mt-[78px] lg:grid-cols-3 lg:gap-[20px] lg:px-0
            "
          >
            {visibleGuides.map((guide) => (
              <article
                key={guide.instanceId}
                className="
                  flex w-full min-w-0 flex-col
                  overflow-hidden rounded-[20px]
                  border border-[#DFE6EBB2] bg-white
                  shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                  sm:rounded-[24px]
                  lg:min-h-[374.25px] lg:rounded-[28px]
                "
              >
                <Link
                  href={guide.href}
                  aria-label={guide.title}
                  className="
                    relative block h-[190px] w-full
                    shrink-0 overflow-hidden

                    sm:h-[200px]
                    lg:h-[215.25px]
                  "
                >
                  <Image
                    src={guide.image}
                    alt={guide.imageAlt}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 384px"
                    className="
                      object-cover object-center
                      transition-transform duration-300
                      hover:scale-105
                    "
                  />
                </Link>

                <div
                  className="
                    flex min-h-[159px] flex-1 flex-col
                    px-5 pb-5 pt-4
                    lg:px-6 lg:pb-6 lg:pt-5
                  "
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="
                        inline-flex min-h-[22px]
                        items-center justify-center
                        rounded-full bg-[#E6F5F2] px-2.5
                        font-inter text-[11px] font-semibold
                        leading-none text-[#00897B]
                        lg:text-[12px]
                      "
                    >
                      {guide.category}
                    </span>

                    <span
                      className="
                        inline-flex items-center gap-1
                        font-inter text-[11px] leading-[18px]
                        text-[#667085] lg:text-[12px]
                      "
                    >
                      <Clock3
                        size={13}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                      {guide.readTime}
                    </span>
                  </div>

                  <h2
                    className="
                      mt-3 font-red-hat-display
                      text-[16px] font-[645] leading-[22px]
                      tracking-[-0.01em] text-[#0C3354]

                      sm:text-[17px]
                      lg:text-[18px] lg:leading-[24px]
                    "
                  >
                    <Link
                      href={guide.href}
                      className="transition-colors hover:text-[#00897B]"
                    >
                      {guide.title}
                    </Link>
                  </h2>

                  <Link
                    href={guide.href}
                    className="
                      mt-auto inline-flex w-fit
                      items-center gap-2 pt-4
                      font-inter text-[13px] font-bold
                      leading-5 text-[#00897B]
                      transition-[gap] duration-200
                      hover:gap-3 lg:text-[14px]
                    "
                  >
                    <span>{guide.linkText}</span>
                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {visibleGuides.length === 0 && (
            <p
              role="status"
              className="
                mx-auto mt-12 max-w-[500px]
                px-4 text-center
                font-red-hat-display
                text-[16px] leading-6 text-[#576574]
              "
            >
              {blogsPage.search.emptyMessage}
            </p>
          )}
        </div>

        {visibleGuides.length > 0 && (
          <div
            className="
              relative mx-auto mt-10
              flex w-full max-w-[1192px]
              items-center justify-center

              sm:mt-12
              lg:mt-[60px]
            "
          >
            <div
              aria-hidden="true"
              className="
                absolute inset-x-0 top-1/2
                h-px -translate-y-1/2 bg-[#EAECF0]
              "
            />

            {!showNoMoreData ? (
              <button
                type="button"
                onClick={() => setShowNoMoreData(true)}
                className="
                  relative z-10 inline-flex min-h-[40px]
                  items-center justify-center gap-2
                  rounded-full bg-[#174B7A] px-5 py-2.5
                  font-inter text-[13px] font-semibold
                  leading-5 text-white
                  transition-colors duration-200
                  hover:bg-[#0C3354]

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#00897B]
                  focus-visible:ring-offset-2

                  sm:text-[14px]
                "
              >
                <Plus
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span>Load more</span>
              </button>
            ) : (
              <span
                role="status"
                className="
                  relative z-10 bg-white px-5 py-2
                  font-red-hat-display text-[14px]
                  font-[467] leading-5 text-[#667085]
                "
              >
                No more data to show
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
