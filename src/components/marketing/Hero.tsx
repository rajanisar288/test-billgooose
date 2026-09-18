'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ChevronRight } from 'lucide-react';

import data from '@/data/content.json';

type ServiceType = 'energy' | 'broadband' | 'mobile' | 'sim-only' | 'insurance' | 'bundle-bills';

export default function Hero() {
  const router = useRouter();

  const { hero } = data;

  // No service is pre-selected. Selection only happens on click/hover.
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  function handleServiceSelect(service: ServiceType) {
    setSelectedService(service);

    if (service === 'bundle-bills') {
      router.push('/compare?service=energy&flow=bundle');
      return;
    }

    if (service === 'sim-only') {
      router.push('/result?service=sim-only');
      return;
    }

    if (service === 'mobile') {
      router.push('/result?service=mobile');
      return;
    }

    router.push(`/compare?service=${service}`);
  }

  return (
    <section className="w-full bg-white px-3 pb-6 pt-3 sm:px-5 lg:px-8 lg:pb-8 lg:pt-5">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* =====================================================
            HERO CARD
        ====================================================== */}
        <div
          className="
            relative

            rounded-[22px]

            bg-[linear-gradient(180deg,rgba(0,168,149,0.5)_0%,rgba(0,168,149,0)_100%)]

            p-px

            lg:rounded-[30px]
          "
        >
          <div
            className="
              relative

              overflow-hidden

              rounded-[21px]

              bg-white

              lg:rounded-[29px]
            "
          >
            {/* =================================================
                BACKGROUND
            ================================================== */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none

                absolute
                inset-0

                bg-[linear-gradient(180deg,#EEFFFB_0%,rgba(238,255,251,0)_100.01%)]
              "
            />

            <div
              className="
                relative

                min-h-[690px]

                sm:min-h-[760px]

                md:min-h-[780px]

                lg:grid
                lg:min-h-[610px]
                lg:grid-cols-[53%_47%]
              "
            >
              {/* =================================================
                  LEFT
              ================================================== */}
              <div
                className="
                  relative
                  z-20

                  px-[11px]
                  pb-0
                  pt-[9px]

                  sm:px-7
                  sm:pt-8

                  md:px-9
                  md:pt-9

                  lg:flex
                  lg:items-center
                  lg:px-12
                  lg:py-16

                  xl:px-16
                "
              >
                <div className="w-full max-w-[720px] md:max-w-none lg:max-w-[720px]">
                  {/* =============================================
                      HEADING
                  ============================================== */}
                  <h1
                    className="
                      w-full

                      font-red-hat-display

                      text-[38px]
                      font-[645]
                      leading-[41.88px]
                      tracking-[0]

                      text-secondary

                      md:text-[52px]
                      md:leading-[58px]

                      lg:text-[60px]
                      lg:font-bold
                      lg:leading-[75.69px]

                      xl:text-[68px]
                    "
                  >
                    <span className="block md:whitespace-nowrap">{hero.heading.firstLine}</span>

                    <span className="block md:whitespace-nowrap">{hero.heading.secondLine}</span>

                    <span
                      className="
                        flex
                        flex-wrap
                        items-baseline

                        gap-x-[0.12em]

                        md:flex-nowrap
                        md:gap-x-[0.16em]

                        lg:gap-x-[0.22em]
                      "
                    >
                      <span>{hero.heading.thirdLineStart}</span>

                      <span>{hero.heading.highlightedWord}</span>

                      <span>{hero.heading.thirdLineEnd}</span>
                    </span>
                  </h1>

                  {/* =============================================
                      DESCRIPTION
                  ============================================== */}
                  <p
                    className="
                      mt-[13px]
                      max-w-[330px]

                      font-red-hat-display
                      text-[12px]
                      font-[467]
                      leading-[14px]

                      text-secondary

                      sm:mt-4
                      sm:max-w-[520px]
                      sm:text-[14px]
                      sm:leading-[1.4]

                      md:max-w-[600px]
                      md:text-[15px]
                      md:leading-[22px]

                      lg:mt-6
                      lg:max-w-[625px]
                      lg:font-inter
                      lg:text-[18px]
                      lg:leading-[1.45]
                    "
                  >
                    {hero.description}
                  </p>

                  {/* =============================================
                      DESKTOP SERVICE GRID
                  ============================================== */}
                  <div
                    className="
                      mt-9

                      hidden

                      h-[176px]
                      w-[568px]
                      max-w-full

                      rounded-[24px]

                      bg-[linear-gradient(180deg,rgba(0,168,149,0.5)_0%,rgba(0,168,149,0)_100%)]

                      p-px

                      shadow-[0px_19px_42px_0px_#B0B0B01A,0px_77px_77px_0px_#B0B0B017,0px_174px_104px_0px_#B0B0B00D,0px_309px_123px_0px_#B0B0B003]

                      lg:block
                    "
                  >
                    <HeroServiceGrid onSelect={handleServiceSelect} />
                  </div>
                </div>
              </div>

              {/* =================================================
                  MOBILE / TABLET IMAGE
              ================================================== */}
              <div
                className="
                  pointer-events-none

                  absolute
                  left-1/2
                  top-[175px]
                  z-10

                  h-[430px]
                  w-[405px]

                  -translate-x-1/2

                  sm:top-[205px]
                  sm:h-[480px]
                  sm:w-[460px]

                  md:top-[255px]
                  md:h-[500px]
                  md:w-[530px]

                  lg:hidden
                "
              >
                <Image
                  src={hero.mobileImage.src}
                  alt={hero.mobileImage.alt}
                  fill
                  priority
                  sizes="(max-width:1023px) 530px"
                  className="
                    object-contain
                    object-top-right
                  "
                />
              </div>

              {/* =================================================
                  DESKTOP IMAGE
              ================================================== */}
              <div
                className="
                  relative

                  hidden
                  min-h-[610px]

                  lg:block
                "
              >
                <div
                  className="
                    absolute
                    inset-0

                    lg:left-[2%]
                    lg:right-[-14%]
                    lg:translate-y-10

                    xl:left-[5%]
                    xl:right-[-28%]
                  "
                >
                  <Image
                    src={hero.image.src}
                    alt={hero.image.alt}
                    fill
                    priority
                    sizes="(min-width:1024px) 54vw"
                    className="
                      object-contain
                      object-center
                    "
                  />
                </div>
              </div>

              {/* =================================================
                  MOBILE / TABLET SERVICE GRID
              ================================================== */}
              <div
                className="
                  absolute
                  bottom-[27px]
                  left-[10px]
                  right-[10px]
                  z-30

                  rounded-[23px]

                  bg-[linear-gradient(180deg,rgba(0,168,149,0.5)_0%,rgba(0,168,149,0)_100%)]

                  p-px

                  shadow-[0px_19px_42px_0px_#B0B0B01A,0px_77px_77px_0px_#B0B0B017]

                  sm:bottom-10
                  sm:left-4
                  sm:right-4

                  md:left-8
                  md:right-8

                  lg:hidden
                "
              >
                <HeroServiceGrid
                  onSelect={handleServiceSelect}
                  compact
                />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            TRUST + PROVIDERS
        ====================================================== */}
        <div className="relative">
          <div className="absolute left-0 right-0 top-[12px] h-px bg-[#EAECF0] lg:top-[14px]" />

          {/* =================================================
              TRUST LABEL
          ================================================== */}
          <div className="relative z-10 flex justify-center lg:justify-start">
            <div
              className="
                flex
                h-[36px]
                w-full
                max-w-[340px]

                items-center
                justify-center

                rounded-[33px]

                border
                border-[#0C111D1A]

                bg-white

                px-4
                py-1

                min-[390px]:h-[38px]
                min-[390px]:w-[420px]
                min-[390px]:max-w-full
                min-[390px]:px-5
              "
            >
              <p
                className="
                  whitespace-nowrap

                  font-red-hat-display
                  text-[13px]
                  font-[467]
                  leading-[20px]

                  text-[#344054]

                  min-[390px]:text-[14px]
                  min-[390px]:leading-[22px]
                "
              >
                {hero.trust.startText}{' '}
                <span className="font-[665]">{hero.trust.highlightedText}</span>{' '}
                {hero.trust.separator} {hero.trust.endText}
              </p>
            </div>
          </div>

          {/* =================================================
              PROVIDERS CONTINUOUS CAROUSEL
          ================================================== */}
          <div
            className="
              provider-carousel

              mt-[18px]
              w-full

              overflow-hidden

              sm:mt-5

              lg:mt-6
            "
          >
            <div
              className="
                provider-carousel-track

                flex
                w-max
                items-center
              "
            >
              {/* ORIGINAL PROVIDER SET */}
              <div
                className="
                  flex
                  shrink-0
                  items-center

                  gap-[22px]
                  pr-[22px]

                  sm:gap-[28px]
                  sm:pr-[28px]

                  md:gap-[34px]
                  md:pr-[34px]

                  lg:gap-[42px]
                  lg:pr-[42px]

                  xl:gap-[48px]
                  xl:pr-[48px]
                "
              >
                {hero.providers.map((provider) => (
                  <div
                    key={provider.id}
                    className="
                      flex
                      h-[38px]
                      shrink-0

                      items-center
                      justify-center

                      sm:h-[42px]

                      md:h-[45px]

                      lg:h-[49px]
                    "
                    style={{
                      width: `${provider.width}px`,
                    }}
                  >
                    <Image
                      src={provider.src}
                      alt={provider.alt}
                      width={provider.width}
                      height={provider.height}
                      className="
                        max-h-[32px]
                        h-auto
                        w-full

                        object-contain

                        sm:max-h-[36px]

                        md:max-h-[42px]

                        lg:max-h-[49px]
                      "
                    />
                  </div>
                ))}
              </div>

              {/* DUPLICATE SET */}
              <div
                aria-hidden="true"
                className="
                  flex
                  shrink-0
                  items-center

                  gap-[22px]
                  pr-[22px]

                  sm:gap-[28px]
                  sm:pr-[28px]

                  md:gap-[34px]
                  md:pr-[34px]

                  lg:gap-[42px]
                  lg:pr-[42px]

                  xl:gap-[48px]
                  xl:pr-[48px]
                "
              >
                {hero.providers.map((provider) => (
                  <div
                    key={`duplicate-${provider.id}`}
                    className="
                      flex
                      h-[38px]
                      shrink-0

                      items-center
                      justify-center

                      sm:h-[42px]

                      md:h-[45px]

                      lg:h-[49px]
                    "
                    style={{
                      width: `${provider.width}px`,
                    }}
                  >
                    <Image
                      src={provider.src}
                      alt=""
                      width={provider.width}
                      height={provider.height}
                      className="
                        max-h-[32px]
                        h-auto
                        w-full

                        object-contain

                        sm:max-h-[36px]

                        md:max-h-[42px]

                        lg:max-h-[49px]
                      "
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SERVICE GRID
========================================================= */

type HeroServiceGridProps = {
  onSelect: (service: ServiceType) => void;
  compact?: boolean;
};

function HeroServiceGrid({ onSelect, compact = false }: HeroServiceGridProps) {
  const services = data.hero.serviceTabs.items;

  return (
    <div
      className={`
        overflow-hidden

        bg-white

        ${compact ? 'rounded-[22px]' : 'rounded-[26px]'}
      `}
    >
      <div
        className="
          grid
          grid-cols-2

          sm:grid-cols-3
        "
      >
        {services.map((service, index) => {
          // 3-col grid (sm+): no right border on last col, no bottom border on last row
          const isThirdColumn = index % 3 === 2;
          const isFirstRow = index < 3;

          // 2-col grid (mobile): no right border on right col, no bottom border on last row
          const isRightColumnMobile = index % 2 === 1;
          const isLastRowMobile = index >= 4;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => {
                onSelect(service.value as ServiceType);
              }}
              className={`
                group

                flex
                items-center

                text-left

                transition-colors

                ${
                  compact
                    ? `
                      min-h-[64px]
                      gap-2
                      px-3

                      sm:min-h-[72px]
                      sm:gap-2.5
                      sm:px-4
                    `
                    : `
                      min-h-[87px]
                      gap-3
                      px-5
                    `
                }

                /* --- Mobile (2 cols): right border on left column, bottom border on all but last row --- */
                ${!isRightColumnMobile ? 'border-r' : ''}
                ${!isLastRowMobile ? 'border-b' : ''}

                /* --- sm+ (3 cols): reset mobile borders, then apply 3-col borders --- */
                sm:border-r-0
                sm:border-b-0
                ${!isThirdColumn ? 'sm:border-r' : ''}
                ${isFirstRow ? 'sm:border-b' : ''}

                border-[#EAECF0]

                /* --- Default: neutral gray look --- */
                bg-white
                text-[#667085]

                /* --- Hover: teal active look (matches old selected style) --- */
                hover:bg-[#E7F6F5]
                hover:text-[#00897B]
              `}
            >
              {/* Default icon */}
              <Image
                src={service.icon}
                alt={service.iconAlt}
                width={48}
                height={48}
                className={`
                  shrink-0
                  object-contain

                  group-hover:hidden

                  ${
                    compact
                      ? `
                        h-[20px]
                        w-[20px]

                        sm:h-[24px]
                        sm:w-[24px]
                      `
                      : `
                        h-[28px]
                        w-[28px]
                      `
                  }
                `}
              />

              {/* Hover (active-colored) icon */}
              <Image
                src={service.activeIcon}
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className={`
                  hidden
                  shrink-0
                  object-contain

                  group-hover:block

                  ${
                    compact
                      ? `
                        h-[20px]
                        w-[20px]

                        sm:h-[24px]
                        sm:w-[24px]
                      `
                      : `
                        h-[28px]
                        w-[28px]
                      `
                  }
                `}
              />

              <span
                className={`
                  min-w-0
                  flex-1

                  font-red-hat-display

                  font-semibold

                  group-hover:font-extrabold

                  ${
                    compact
                      ? `
                        text-[12px]

                        min-[390px]:text-[13px]

                        sm:text-[15px]
                      `
                      : `
                        text-[18px]
                        leading-[1.15]
                        xl:text-[19px]
                      `
                  }
                `}
              >
                {service.label}
              </span>

              {/* Chevron only on hover */}
              <ChevronRight
                aria-hidden="true"
                className="
                  hidden
                  h-5
                  w-5
                  shrink-0

                  text-[#0C3354]

                  group-hover:block
                "
                strokeWidth={2}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
