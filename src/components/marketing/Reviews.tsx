'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { ArrowLeft, ArrowRight } from 'lucide-react';

import data from '@/data/content.json';

type NavigationDirection = 'previous' | 'next';

export default function Reviews() {
  const { reviews } = data;

  const [activeIndex, setActiveIndex] = useState(0);

  const [activeDirection, setActiveDirection] = useState<NavigationDirection>('next');

  const [isPaused, setIsPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  const visibleReviews = Array.from({ length: 3 }, (_, index) => {
    return reviews.items[(activeIndex + index) % reviews.items.length];
  });

  const handlePrevious = useCallback(() => {
    setActiveDirection('previous');

    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? reviews.items.length - 1 : currentIndex - 1,
    );
  }, [reviews.items.length]);

  const handleNext = useCallback(() => {
    setActiveDirection('next');

    setActiveIndex((currentIndex) => (currentIndex + 1) % reviews.items.length);
  }, [reviews.items.length]);

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      handleNext();
    }, 2000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [handleNext, isPaused]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrevious();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    }
  };

  const getArrowButtonClasses = (direction: NavigationDirection) => {
    const isActive = activeDirection === direction;

    return [
      'flex items-center justify-center rounded-full',
      'border transition-all duration-200',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-[#00897B]',
      'focus-visible:ring-offset-2',
      'active:scale-95',
      'h-[42px] w-[42px]',
      'min-[390px]:h-[52px] min-[390px]:w-[52px]',
      isActive
        ? 'border-[#00897B] bg-[#00897B] text-white hover:bg-[#00796D]'
        : 'border-[#E4E4E4] bg-white text-secondary hover:border-[#00897B] hover:text-[#00897B]',
    ].join(' ');
  };

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full bg-white px-3 pb-[72px] pt-[72px] outline-none min-[360px]:px-4 min-[390px]:px-5 min-[390px]:pb-[100px] min-[390px]:pt-[100px] lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1216px]">
        {/* Reviews badge */}
        <div className="flex justify-center">
          <div className="inline-flex min-h-[28px] items-center gap-1.5 rounded-full border border-[#EAECF0] bg-white px-2.5 py-1 shadow-[0px_1px_2px_0px_rgba(15,30,60,0.04)] min-[390px]:min-h-[30px] min-[390px]:gap-2 min-[390px]:px-3 min-[390px]:py-1.5">
            <Image
              src={reviews.badge.icon}
              alt=""
              width={20}
              height={20}
              className="h-4 w-4 object-contain min-[390px]:h-5 min-[390px]:w-5"
            />

            <span className="font-red-hat-display text-[12px] font-medium leading-none text-secondary min-[390px]:text-[14px]">
              {reviews.badge.text}
            </span>
          </div>
        </div>

        {/* Section heading */}
        <div className="mx-auto mt-4 max-w-[850px] text-center min-[390px]:mt-5">
          <h2 className="font-red-hat-display text-[27px] font-[645] leading-[33px] tracking-[0] text-secondary min-[360px]:text-[28px] min-[360px]:leading-[34px] min-[390px]:text-[30px] min-[390px]:leading-[36px] sm:text-[38px] lg:text-[44px] lg:font-bold lg:leading-[52px]">
            <span className="block sm:inline">{reviews.heading.before}</span>{' '}
            {/* Plain Household text - no box / no SVG */}
            <span className="font-[645] text-secondary">{reviews.heading.highlighted}</span>
          </h2>

          <p className="mx-auto mt-4 max-w-[320px] font-red-hat-display text-[12px] font-[467] leading-[16px] tracking-[0] text-secondary min-[360px]:max-w-[340px] min-[360px]:text-[13px] min-[390px]:max-w-[380px] min-[390px]:text-[14px] min-[390px]:leading-[100%] lg:max-w-none lg:text-[18px] lg:leading-[1.5]">
            {reviews.description}
          </p>
        </div>

        {/* Reviews */}
        <div className="mt-[36px] min-[390px]:mt-[48px]">
          {/* Desktop cards */}
          <div className="hidden grid-cols-3 gap-6 lg:grid">
            {visibleReviews.map((review, index) => (
              <ReviewCard
                key={`${review.id}-${activeIndex}-${index}`}
                review={review}
                starIcon={reviews.starIcon}
                quoteIcon={reviews.quoteIcon}
                desktop
              />
            ))}
          </div>

          {/* Mobile slider */}
          <div
            className="overflow-hidden lg:hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {reviews.items.map((review) => (
                <div
                  key={review.id}
                  className="flex w-full shrink-0 justify-center px-1"
                >
                  <ReviewCard
                    review={review}
                    starIcon={reviews.starIcon}
                    quoteIcon={reviews.quoteIcon}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="mt-8 flex items-center justify-center gap-3 min-[390px]:mt-12">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Show previous review"
              className={getArrowButtonClasses('previous')}
            >
              <ArrowLeft
                size={20}
                strokeWidth={1.8}
                aria-hidden="true"
                className="min-[390px]:h-6 min-[390px]:w-6"
              />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Show next review"
              className={getArrowButtonClasses('next')}
            >
              <ArrowRight
                size={20}
                strokeWidth={1.8}
                aria-hidden="true"
                className="min-[390px]:h-6 min-[390px]:w-6"
              />
            </button>
          </div>
        </div>

        {/* Bottom dashed line */}
        <div className="mt-[56px] border-t-2 border-dashed border-[#DFE6EB] min-[390px]:mt-[72px]" />
      </div>
    </section>
  );
}

type Review = {
  id: string;
  text: string;
  name: string;
  city: string;
  savedLabel: string;
  amount: string;
  avatar?: string;
  initials?: string;
};

type ReviewCardProps = {
  review: Review;
  starIcon: string;
  quoteIcon: string;
  desktop?: boolean;
};

function ReviewCard({ review, starIcon, quoteIcon, desktop = false }: ReviewCardProps) {
  return (
    <article
      className={[
        'flex w-full flex-col bg-white',
        'border border-[#EAECF0] border-t-[#DFE6EBB2]',
        'shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]',
        desktop
          ? 'min-h-[236px] max-w-[389px] rounded-[28px] p-6'
          : 'h-[210px] max-w-[340px] rounded-[18px] p-5 min-[360px]:h-[220px] min-[360px]:max-w-[360px] min-[360px]:rounded-[19px] min-[360px]:p-6 min-[390px]:h-[230px] min-[390px]:max-w-[389.33px] min-[390px]:rounded-[20px] min-[390px]:p-7',
      ].join(' ')}
    >
      {/* Stars and quote icon */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <Image
              key={index}
              src={starIcon}
              alt=""
              width={16}
              height={16}
              className={
                desktop
                  ? 'h-4 w-4 object-contain'
                  : 'h-[11px] w-[11.5px] object-contain min-[360px]:h-[12px] min-[360px]:w-[12.5px] min-[390px]:h-[12.71px] min-[390px]:w-[13.33px]'
              }
            />
          ))}
        </div>

        <Image
          src={quoteIcon}
          alt=""
          width={32}
          height={32}
          className="h-7 w-7 object-contain min-[390px]:h-8 min-[390px]:w-8"
        />
      </div>

      {/* Review text */}
      <p
        className={[
          'mt-4 font-red-hat-display font-[467] text-secondary',
          desktop
            ? 'text-[16px] leading-[24px]'
            : 'text-[13px] leading-[19px] min-[360px]:text-[14px] min-[360px]:leading-[21px] min-[390px]:text-[16px] min-[390px]:leading-[24px]',
        ].join(' ')}
      >
        “{review.text}”
      </p>

      {/* Reviewer information */}
      <div className="mt-auto flex items-end justify-between gap-3 pt-4 min-[390px]:gap-4 min-[390px]:pt-5">
        <div className="flex min-w-0 items-center gap-2.5 min-[390px]:gap-3">
          {review.avatar ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full min-[390px]:h-11 min-[390px]:w-11">
              <Image
                src={review.avatar}
                alt={review.name}
                fill
                sizes="44px"
                className="object-cover object-center"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#012854_0%,#00B1AA_100%)] font-red-hat-display text-[11px] font-bold text-white min-[390px]:h-11 min-[390px]:w-11 min-[390px]:text-[13px]">
              {review.initials}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate font-red-hat-display text-[12px] font-[645] leading-[16px] text-secondary min-[360px]:text-[13px] min-[390px]:text-[14px] min-[390px]:leading-[1.25]">
              {review.name}
            </p>

            <p className="mt-1 font-red-hat-display text-[10px] leading-none text-secondary min-[390px]:text-[12px]">
              {review.city}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-red-hat-display text-[10px] leading-none text-secondary min-[390px]:text-[12px]">
            {review.savedLabel}
          </p>

          <p className="mt-1 font-red-hat-display text-[17px] font-[900] font-extrabold leading-none text-secondary min-[390px]:text-[20px]">
            {review.amount}
          </p>
        </div>
      </div>
    </article>
  );
}
