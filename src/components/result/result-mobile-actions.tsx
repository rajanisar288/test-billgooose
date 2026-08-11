'use client';

import { useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

import data from '@/data/content.json';

type CompareService = {
  id: string;
  label: string;
  icon: string;
  alt: string;
};

function getServiceLabel(id: string, alt: string): string {
  const value = `${id} ${alt}`.toLowerCase();

  if (value.includes('broadband')) {
    return 'Broadband';
  }

  if (value.includes('mobile')) {
    return 'Mobile';
  }

  if (value.includes('insurance') || value.includes('shield')) {
    return 'Insurance';
  }

  if (value.includes('credit') || value.includes('card')) {
    return 'Credit Card';
  }

  if (value.includes('energy') || value.includes('electric')) {
    return 'Energy';
  }

  if (value.includes('loan')) {
    return 'Loans';
  }

  return alt;
}

export default function ResultMobileActions() {
  const router = useRouter();
  const { hero } = data.resultPage;

  const compareServices = useMemo<CompareService[]>(
    () =>
      hero.services.map((service) => ({
        id: service.id,
        label: getServiceLabel(service.id, service.alt),
        icon: service.icon,
        alt: service.alt,
      })),
    [hero.services],
  );

  return (
    <section
      className="
        w-full
        bg-white

        md:hidden
      "
    >
      {/* Top action row */}
      <div
        className="
          flex h-[49px]
          w-full
          items-center
          justify-between
          gap-3

          border-b
          border-[#E9EAEB]

          bg-white

          px-4

          min-[390px]:px-5
        "
      >
        {/* Back */}
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
          className="
            inline-flex
            shrink-0
            items-center
            gap-1.5

            font-red-hat-display
            text-[14px]
            font-semibold
            leading-[21px]
            tracking-[0]
            text-[#6A7282]

            transition-colors

            hover:text-[#0C3354]
          "
        >
          <ChevronLeft
            aria-hidden="true"
            className="
              h-[18px]
              w-[18px]
              shrink-0
            "
            strokeWidth={1.8}
          />
          Back
        </button>

        {/* Right actions */}
        <div
          className="
            ml-auto
            flex min-w-0
            items-center
            gap-3

            min-[390px]:gap-4
          "
        >
          <Link
            href="/compare"
            className="
              shrink-0
              whitespace-nowrap

              font-red-hat-display
              text-[13px]
              font-semibold
              leading-6
              tracking-[0]
              text-[#181D27]

              underline
              decoration-[0.65px]
              underline-offset-[2px]
            "
          >
            Edit answers
          </Link>

          <span
            aria-hidden="true"
            className="
              shrink-0
              text-[14px]
              font-bold
              leading-none
              text-[#181D27]
            "
          >
            •
          </span>

          <button
            type="button"
            className="
              shrink-0
              whitespace-nowrap

              font-red-hat-display
              text-[13px]
              font-semibold
              leading-6
              tracking-[0]
              text-[#181D27]

              underline
              decoration-[0.65px]
              underline-offset-[2px]
            "
          >
            Save search
          </button>
        </div>
      </div>

      {/* Also compare */}
      <div
        className="
          flex h-[53.707px]
          w-full
          items-center

          border-b-[0.71px]
          border-[#E5E7EB]

          bg-white
        "
      >
        {/* Fixed heading */}
        <div
          className="
            relative z-10
            flex h-full
            shrink-0
            items-center

            bg-white

            pl-4
            pr-2

            min-[390px]:pl-5
          "
        >
          <span
            className="
              whitespace-nowrap

              font-red-hat-display
              text-[13px]
              font-medium
              leading-[19.5px]
              tracking-[0]
              text-[#667085]
            "
          >
            Also compare:
          </span>
        </div>

        {/* Continuous automatic slider */}
        <div
          className="
            relative
            min-w-0
            flex-1
            overflow-hidden
          "
        >
          <div
            className="
              flex w-max
              items-center
              gap-[6px]

              animate-[resultMarquee_18s_linear_infinite]
            "
          >
            {[...compareServices, ...compareServices].map((service, index) => (
              <Link
                key={`${service.id}-${index}`}
                href="/compare"
                className="
                    inline-flex h-[30px]
                    shrink-0
                    items-center
                    gap-[5px]

                    rounded-[8px]

                    border
                    border-[#EAECF0]

                    bg-white

                    px-[5px]
                    pr-2

                    shadow-[0px_1px_2px_0px_rgba(16,24,40,0.04)]

                    transition-colors

                    hover:bg-[#F9FAFB]
                  "
              >
                <span
                  className="
                      flex h-[24px]
                      w-[24px]
                      shrink-0
                      items-center
                      justify-center

                      rounded-[6px]

                      bg-[#F2F4F7]
                    "
                >
                  <Image
                    src={service.icon}
                    alt={service.alt}
                    width={20}
                    height={20}
                    className="
                        h-5
                        w-5
                        object-contain
                      "
                  />
                </span>

                <span
                  className="
                      whitespace-nowrap

                      font-red-hat-display
                      text-[13px]
                      font-semibold
                      leading-[19.5px]
                      tracking-[0]
                      text-[#344054]
                    "
                >
                  {service.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
