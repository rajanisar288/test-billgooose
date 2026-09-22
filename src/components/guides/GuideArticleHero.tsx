'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ChevronRight, Clock3 } from 'lucide-react';

type GuideHero = {
  badge: { category: string; readTime: string };
  heading: string;
  breadcrumb: {
    home: { label: string; href: string };
    guides: { label: string; href: string };
    current: string;
  };
  image: { src: string; alt: string };
};

type GuideArticleHeroProps = {
  heroData: GuideHero;
};

export default function GuideArticleHero({ heroData }: GuideArticleHeroProps) {
  const page = heroData;

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

        <div
          className="
            relative z-10
            flex flex-col items-center
            px-4 pt-8 text-center
            sm:px-6 sm:pt-10
            md:px-8 md:pt-11
            lg:px-[52px] lg:pt-[44px]
          "
        >
          <div
            className="
              inline-flex min-h-[30px]
              items-center justify-center gap-2
              rounded-[16px]
              bg-[#E6F5F2]
              px-3 py-1
              sm:min-h-[32px]
              lg:min-h-[30px]
            "
          >
            <span
              className="
                inline-flex items-center justify-center
                rounded-full bg-white
                px-2.5 py-0.5
                font-inter text-[12px] font-extrabold
                leading-[18px] text-[#00897B]
                sm:text-[13px]
                lg:text-[14px]
              "
            >
              {page.badge.category}
            </span>

            <span
              className="
                inline-flex items-center gap-1
                font-inter text-[12px] font-extrabold
                leading-[18px] text-[#00897B]
                sm:text-[13px]
                lg:text-[14px]
              "
            >
              <Clock3
                aria-hidden="true"
                className="h-[14px] w-[14px] shrink-0"
                strokeWidth={2.2}
              />
              {page.badge.readTime}
            </span>
          </div>

          <h1
            className="
              mt-4 max-w-[950px]
              font-red-hat-display font-[845]
              text-[30px] leading-[38px]
              tracking-[-0.02em] text-[#0C3354]
              sm:text-[36px] sm:leading-[44px]
              md:text-[42px] md:leading-[52px]
              lg:text-[48px] lg:leading-[60px]
            "
          >
            {page.heading}
          </h1>

          <nav
            aria-label="Breadcrumb"
            className="
              mt-3
              flex flex-wrap items-center justify-center gap-2
              font-red-hat-display font-[467]
              text-[12px] leading-[18px] text-[#0C3354]
              sm:text-[14px]
              md:text-[16px]
              lg:text-[18px] lg:leading-[24px]
            "
          >
            <Link
              href={page.breadcrumb.home.href}
              className="
                underline decoration-[1px]
                underline-offset-[3px]
                transition-colors hover:text-[#00897B]
              "
            >
              {page.breadcrumb.home.label}
            </Link>

            <ChevronRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              strokeWidth={1.8}
            />

            <Link
              href={page.breadcrumb.guides.href}
              className="
                underline decoration-[1px]
                underline-offset-[3px]
                transition-colors hover:text-[#00897B]
              "
            >
              {page.breadcrumb.guides.label}
            </Link>

            <ChevronRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              strokeWidth={1.8}
            />

            <span>{page.breadcrumb.current}</span>
          </nav>

          <div
            className="
              relative mt-8
              aspect-[1096/571]
              w-full max-w-[1096px]
              overflow-hidden rounded-[16px]
              bg-[#F8FAFC]
              sm:mt-10 sm:rounded-[20px]
              md:mt-12 md:rounded-[24px]
              lg:mt-[42px] lg:rounded-[28px]
            "
          >
            <Image
              src={page.image.src}
              alt={page.image.alt}
              fill
              priority
              quality={100}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 1096px"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
