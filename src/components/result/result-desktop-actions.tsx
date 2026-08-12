'use client';

import { useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

import data from '@/data/content.json';

/* =========================================================
   Replace only these paths if your asset filenames differ.
========================================================= */

const COMPARING_ICON = '/images/comparing-energy-icon.png';
const SAVING_ICON = '/images/percentage-icon.png';
const BUNDLE_ICON = '/images/bundle-icon.png';

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
    return 'Credit Cards';
  }

  if (value.includes('energy') || value.includes('electric')) {
    return 'Energy';
  }

  if (value.includes('loan')) {
    return 'Loans';
  }

  return alt;
}

export default function ResultDesktopActions() {
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

  /*
   * Energy is already the active comparison.
   * Desktop screenshot shows the other four options.
   */
  const desktopCompareServices = compareServices
    .filter((service) => service.label !== 'Energy')
    .slice(0, 4);

  const handleBack = () => {
    router.push('/current-usage');
  };

  return (
    <section
      className="
        hidden
        w-full
        bg-[#F9F9F9]
        pb-10

        lg:-mt-6
        lg:block

        xl:-mt-10
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1096px]

          px-10

          xl:px-0
        "
      >
        {/* =====================================================
            TOP ROW
        ====================================================== */}
        <div
          className="
            flex
            h-[62px]
            w-full
            items-center
            justify-between
            gap-6
          "
        >
          {/* Left side */}
          <div
            className="
              flex
              min-w-0
              items-center
              gap-4
            "
          >
            {/* Back */}
            <button
              type="button"
              onClick={handleBack}
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-1

                font-red-hat-display
                text-[14px]
                font-[550]
                leading-5
                tracking-[0]
                text-[#6A7282]

                transition-colors

                hover:text-[#0C3354]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#00897B]
                focus-visible:ring-offset-2
              "
            >
              <ChevronLeft
                aria-hidden="true"
                className="
                  h-4
                  w-4
                  shrink-0
                "
                strokeWidth={1.8}
              />
              Back
            </button>

            {/* Comparing Energy */}
            <div
              className="
                inline-flex
                h-[50px]
                w-[216px]
                shrink-0
                items-center

                gap-2

                rounded-[100px]

                border
                border-[#D0D5DD]

                bg-white

                py-[5px]
                pl-[5px]
                pr-[18px]

                shadow-[0px_1px_2px_0px_#1018280D]
              "
            >
              {/* Whole bulb artwork */}
              <Image
                src={COMPARING_ICON}
                alt=""
                width={40}
                height={40}
                aria-hidden="true"
                className="
                  h-10
                  w-10
                  shrink-0
                  object-contain
                "
              />

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-1
                  whitespace-nowrap
                "
              >
                <span
                  className="
                    font-inter
                    text-[16px]
                    font-normal
                    leading-6
                    tracking-[0]
                    text-[#667085]
                  "
                >
                  Comparing:
                </span>

                <span
                  className="
                    font-inter
                    text-[16px]
                    font-normal
                    leading-6
                    tracking-[0]
                    text-[#101828]
                  "
                >
                  Energy
                </span>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-3
            "
          >
            <Link
              href="/compare"
              className="
                whitespace-nowrap

                font-red-hat-display
                text-[16px]
                font-[550]
                leading-6
                tracking-[0]
                text-[#181D27]

                underline
                decoration-[0.8px]
                underline-offset-[3px]
              "
            >
              Edit answers
            </Link>

            <span
              aria-hidden="true"
              className="
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
                whitespace-nowrap

                font-red-hat-display
                text-[16px]
                font-[550]
                leading-6
                tracking-[0]
                text-[#181D27]

                underline
                decoration-[0.8px]
                underline-offset-[3px]
              "
            >
              Save search
            </button>
          </div>
        </div>

        {/* =====================================================
            SAVINGS BAR
        ====================================================== */}
        <div
          className="
            flex
            h-[45px]
            w-full
            items-center
            justify-between

            rounded-[10px]

            border
            border-[#AAF0C4]

            bg-[#F6FEF9]

            p-3
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
            "
          >
            <Image
              src={SAVING_ICON}
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
              className="
                h-[14px]
                w-[14px]
                shrink-0
                object-contain
              "
            />

            <p
              className="
                min-w-0

                font-red-hat-display
                text-[14px]
                font-[467]
                leading-4
                tracking-[0]
                text-[#099250]
              "
            >
              <strong
                className="
                  font-[645]
                  text-[#099250]
                "
              >
                You could save up to £580/yr
              </strong>{' '}
              by switching to the best deal below
            </p>
          </div>
        </div>

        {/* =====================================================
            ALSO COMPARE ROW
        ====================================================== */}
        <div
          className="
            flex
            min-h-[55px]
            w-full
            items-center
          "
        >
          {/* Also compare */}
          <span
            className="
              mr-3
              shrink-0
              whitespace-nowrap

              font-red-hat-display
              text-[14px]
              font-[550]
              leading-5
              tracking-[0]
              text-[#6A7282]
            "
          >
            Also compare:
          </span>

          {/* Comparison tabs */}
          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
            "
          >
            {desktopCompareServices.map((service) => (
              <Link
                key={service.id}
                href="/compare"
                className="
                    inline-flex
                    h-[31px]
                    min-w-[102px]
                    shrink-0
                    items-center
                    justify-center
                    gap-1

                    rounded-[8px]

                    border
                    border-[#EAECF0]

                    bg-white

                    p-1

                    transition-colors

                    hover:bg-[#F9FAFB]
                  "
              >
                <Image
                  src={service.icon}
                  alt={service.alt}
                  width={23}
                  height={23}
                  className="
                      h-[23px]
                      w-[23px]
                      shrink-0
                      object-contain
                    "
                />

                <span
                  className="
                      whitespace-nowrap

                      font-red-hat-display
                      text-[13px]
                      font-[550]
                      leading-5
                      tracking-[0]
                      text-[#344054]
                    "
                >
                  {service.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div
            aria-hidden="true"
            className="
              mx-4
              h-[26px]
              w-px
              shrink-0
              bg-[#EAECF0]
            "
          />

          {/* Bundle link */}
          <Link
            href="/compare"
            className="
              inline-flex
              shrink-0
              items-center
              gap-2

              whitespace-nowrap

              font-red-hat-display
              text-[16px]
              font-[550]
              leading-6
              tracking-[0]
              text-[#147AD2]

              transition-colors

              hover:text-[#0D66B5]
            "
          >
            <Image
              src={BUNDLE_ICON}
              alt=""
              width={13}
              height={16}
              aria-hidden="true"
              className="
                h-4
                w-[13px]
                shrink-0
                object-contain
              "
            />
            Bundle &amp; save up to £820/yr
          </Link>
        </div>
      </div>
    </section>
  );
}
