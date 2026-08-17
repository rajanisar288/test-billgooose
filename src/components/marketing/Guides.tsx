'use client';

import { useEffect, useRef } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Clock3 } from 'lucide-react';

import data from '@/data/content.json';

export default function Guides() {
  const { guides } = data;

  const sliderRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    let animationFrameId: number;
    let previousTime = performance.now();

    const moveSlider = (currentTime: number) => {
      const elapsedTime = currentTime - previousTime;
      previousTime = currentTime;

      if (!isPausedRef.current) {
        // Increase this value to make the carousel faster.
        const speed = 0.035;

        slider.scrollLeft += elapsedTime * speed;

        // Because the cards are duplicated, reset after the first set.
        const firstSetWidth = slider.scrollWidth / 2;

        if (slider.scrollLeft >= firstSetWidth) {
          slider.scrollLeft -= firstSetWidth;
        }
      }

      animationFrameId = requestAnimationFrame(moveSlider);
    };

    animationFrameId = requestAnimationFrame(moveSlider);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="min-h-[620px] overflow-hidden rounded-t-[18px] bg-[linear-gradient(180deg,#F2F9F8_57.79%,rgba(242,249,248,0)_100%)] pb-[48px] pt-4 min-[360px]:min-h-[650px] min-[360px]:rounded-t-[19px] min-[390px]:min-h-[687px] min-[390px]:rounded-t-[20px] lg:min-h-[668px] lg:rounded-t-[30px] lg:px-[75px] lg:py-[60px]">
          {/* Heading content */}
          <div className="px-4 min-[360px]:px-5 lg:px-0">
            {/* Section label */}
            <div className="inline-flex h-[28px] items-center justify-center gap-1.5 rounded-[14px] bg-white px-2.5 shadow-[0px_0px_0px_1px_rgba(44,64,94,0.06),0px_1px_1px_0px_rgba(44,64,94,0.04),0px_2px_4px_0px_rgba(44,64,94,0.08)] min-[390px]:h-[30px] min-[390px]:px-3">
              <Image
                src={guides.badge.icon}
                alt=""
                width={20}
                height={20}
                className="h-4 w-4 object-contain min-[390px]:h-5 min-[390px]:w-5"
              />

              <span className="font-red-hat-display text-[11px] font-[467] leading-none text-secondary min-[390px]:text-[14px] lg:font-medium">
                {guides.badge.text}
              </span>
            </div>

            {/* Heading row */}
            <div className="mt-4 flex flex-col items-start lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="max-w-[310px] font-red-hat-display text-[26px] font-[645] leading-[32px] tracking-[0] text-secondary min-[360px]:max-w-[340px] min-[360px]:text-[28px] min-[360px]:leading-[34px] min-[390px]:max-w-[370px] min-[390px]:text-[30px] min-[390px]:leading-[36px] sm:max-w-none sm:text-[38px] lg:text-[44px] lg:font-bold lg:leading-[1.12] lg:tracking-[-1px]">
                  {guides.heading}
                </h2>

                <p className="mt-3 max-w-[315px] font-red-hat-display text-[12px] font-[467] leading-[15px] tracking-[0] text-secondary min-[360px]:max-w-[340px] min-[360px]:text-[13px] min-[360px]:leading-[16px] min-[390px]:max-w-[385px] min-[390px]:text-[14px] min-[390px]:leading-[100%] sm:max-w-none lg:text-[18px] lg:leading-[1.5]">
                  {guides.description}
                </p>
              </div>

              <Link
                href={guides.allGuides.href}
                className="mt-4 inline-flex h-9 w-32 shrink-0 items-center justify-center gap-2 rounded-full border border-[#01285433] bg-white px-4 py-2 font-inter text-[13px] font-[467] leading-none text-secondary shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:-translate-y-0.5 min-[390px]:text-[14px] lg:mt-0 lg:self-auto lg:font-inter lg:font-[600]"
              >
                <span>{guides.allGuides.text}</span>

                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Mobile + tablet + 1024 laptop automatic slider */}
          <div
            className="
              mt-7
              overflow-hidden

              min-[1100px]:hidden
            "
          >
            <div
              ref={sliderRef}
              onMouseEnter={() => {
                isPausedRef.current = true;
              }}
              onMouseLeave={() => {
                isPausedRef.current = false;
              }}
              onTouchStart={() => {
                isPausedRef.current = true;
              }}
              onTouchEnd={() => {
                isPausedRef.current = false;
              }}
              className="
                flex
                gap-4
                overflow-x-auto
                pb-4

                [scrollbar-width:none]

                [&::-webkit-scrollbar]:hidden
              "
            >
              {/* First card set */}
              <div className="flex shrink-0 gap-4 pl-4 min-[360px]:pl-5 lg:pl-0">
                {guides.items.map((guide) => (
                  <MobileGuideCard
                    key={`primary-${guide.id}`}
                    guide={guide}
                  />
                ))}
              </div>

              {/* Duplicate set for continuous looping */}
              <div
                aria-hidden="true"
                className="flex shrink-0 gap-4 pr-4 min-[360px]:pr-5 lg:pr-0"
              >
                {guides.items.map((guide) => (
                  <MobileGuideCard
                    key={`duplicate-${guide.id}`}
                    guide={guide}
                    duplicate
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop guide cards - 1100px+ only */}
          <div
            className="
              mt-10
              hidden
              grid-cols-1
              justify-items-center
              gap-5

              min-[1100px]:grid
              min-[1100px]:grid-cols-3

              xl:grid-cols-4
            "
          >
            {guides.items.map((guide) => (
              <DesktopGuideCard
                key={guide.id}
                guide={guide}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Guide = {
  id: string;
  category: string;
  readTime: string;
  title: string;
  image: string;
  imageAlt: string;
  linkText: string;
  href: string;
};

type MobileGuideCardProps = {
  guide: Guide;
  duplicate?: boolean;
};

function MobileGuideCard({ guide, duplicate = false }: MobileGuideCardProps) {
  return (
    <article
      aria-hidden={duplicate || undefined}
      className="
        flex
        h-[338px]
        w-[260px]
        shrink-0
        flex-col
        overflow-hidden

        rounded-[22px]

        border
        border-[#EAECF0]
        border-t-[#DFE6EBB2]

        bg-white

        shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

        min-[360px]:h-[356px]
        min-[360px]:w-[274px]
        min-[360px]:rounded-[25px]

        min-[390px]:h-[374.25px]
        min-[390px]:w-[289px]
        min-[390px]:rounded-[28px]
      "
    >
      {/* Guide image */}
      <div className="relative h-[188px] w-full shrink-0 overflow-hidden min-[360px]:h-[202px] min-[390px]:h-[215.25px]">
        <Image
          src={guide.image}
          alt={duplicate ? '' : guide.imageAlt}
          fill
          sizes="(max-width: 359px) 260px, (max-width: 389px) 274px, 289px"
          className="object-cover object-center"
        />
      </div>

      {/* Guide information */}
      <div className="flex min-h-0 flex-1 flex-col p-4 min-[390px]:p-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 items-center justify-center rounded-full bg-[#00897B1A] px-2.5 font-inter text-[11px] font-bold leading-none text-primary min-[390px]:text-[12px]">
            {guide.category}
          </span>

          <span className="inline-flex items-center gap-1 font-inter text-[11px] leading-none text-[#576574] min-[390px]:text-[12px]">
            <Clock3
              size={12}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {guide.readTime}
          </span>
        </div>

        <h3 className="mt-3 font-manrope text-[14px] font-bold leading-[20px] tracking-[-0.28px] text-secondary min-[360px]:text-[15px] min-[360px]:leading-[21px] min-[390px]:text-[16px] min-[390px]:leading-[22px] min-[390px]:tracking-[-0.32px]">
          {guide.title}
        </h3>

        <Link
          href={guide.href}
          tabIndex={duplicate ? -1 : undefined}
          className="mt-auto inline-flex w-fit items-center gap-2 pt-3 font-inter text-[13px] font-semibold leading-5 text-primary transition-[gap] duration-200 hover:gap-3 min-[390px]:text-[14px]"
        >
          <span>{guide.linkText}</span>

          <ArrowRight
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

type DesktopGuideCardProps = {
  guide: Guide;
};

function DesktopGuideCard({ guide }: DesktopGuideCardProps) {
  return (
    <article className="flex h-[374px] w-full max-w-[287px] flex-col overflow-hidden rounded-[28px] border-t border-t-[rgba(223,230,235,0.7)] bg-white shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]">
      {/* Guide image */}
      <div className="relative h-[215px] w-full shrink-0 overflow-hidden">
        <Image
          src={guide.image}
          alt={guide.imageAlt}
          fill
          sizes="287px"
          className="object-cover object-center"
        />
      </div>

      {/* Guide information */}
      <div className="flex min-h-[159px] flex-1 flex-col px-6 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex min-h-6 min-w-[62px] items-center justify-center rounded-full bg-[rgba(0,137,123,0.1)] px-2 font-inter text-[12px] font-bold leading-none text-primary">
            {guide.category}
          </span>

          <span className="inline-flex items-center gap-1 font-inter text-[12px] leading-none text-[#576574]">
            <Clock3
              size={12}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {guide.readTime}
          </span>
        </div>

        <h3 className="mt-3 font-red-hat-display text-[16px] font-bold leading-[1.35] text-secondary">
          {guide.title}
        </h3>

        <Link
          href={guide.href}
          className="mt-auto inline-flex w-fit items-center gap-2 pt-3 font-inter text-[14px] font-bold text-primary transition-[gap] duration-200 hover:gap-3"
        >
          <span>{guide.linkText}</span>

          <ArrowRight
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
