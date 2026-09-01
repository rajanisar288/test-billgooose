'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ChevronRight } from 'lucide-react';

import data from '@/data/content.json';

type ServiceType = 'energy' | 'broadband' | 'mobile' | 'sim-only' | 'insurance' | 'bundle-bills';

export default function LowerHero() {
  const router = useRouter();

  const { lowerHero } = data;

  const [selectedService, setSelectedService] = useState<ServiceType>(
    lowerHero.serviceTabs.defaultValue as ServiceType,
  );

  function handleServiceSelect(service: ServiceType) {
    setSelectedService(service);

    if (service === 'bundle-bills') {
      router.push('/compare?service=energy&flow=bundle');
      return;
    }

    router.push(`/compare?service=${service}`);
  }

  return (
    <section
      className="
        w-full
        bg-white

        px-2
        pb-[72px]

        min-[360px]:px-3

        min-[390px]:px-5
        min-[390px]:pb-[100px]

        md:px-6
        md:pb-[100px]

        lg:px-8
      "
    >
      <div className="mx-auto w-full max-w-[1216px]">
        <div
          className="
            relative
            mx-auto

            h-[540px]
            w-full
            max-w-[336px]

            overflow-hidden

            rounded-[16px]

            bg-[linear-gradient(100deg,#002B56_0.73%,#01ACA7_108.32%)]

            min-[360px]:h-[570px]
            min-[360px]:max-w-[365px]
            min-[360px]:rounded-[18px]

            min-[390px]:h-[610px]
            min-[390px]:max-w-[400px]
            min-[390px]:rounded-[20px]

            md:h-[340px]
            md:max-w-none
            md:rounded-[24px]

            lg:h-[460px]
            lg:max-w-none
            lg:rounded-[30px]

            xl:h-[490px]
          "
        >
          {/* =====================================================
              MOBILE IMAGE
          ====================================================== */}
          <div
            className="
              pointer-events-none

              absolute
              bottom-0
              left-1/2
              z-0

              h-[300px]
              w-[330px]

              -translate-x-1/2

              min-[360px]:h-[330px]
              min-[360px]:w-[355px]

              min-[390px]:h-[365px]
              min-[390px]:w-[390px]

              md:hidden
            "
          >
            <Image
              src={lowerHero.mobileBackgroundImage.src}
              alt={lowerHero.mobileBackgroundImage.alt}
              fill
              priority
              className="
                object-contain
                object-bottom
              "
            />
          </div>

          {/* =====================================================
              TABLET IMAGE
          ====================================================== */}
          <div
            className="
              pointer-events-none
              absolute
              z-0

              hidden

              md:right-[-62px]
              md:top-[55%]
              md:block
              md:h-[94%]
              md:w-[54%]
              md:-translate-y-1/2

              lg:hidden
            "
          >
            <Image
              src={lowerHero.backgroundImage.src}
              alt={lowerHero.backgroundImage.alt}
              fill
              priority
              className="
                object-contain
                object-center
              "
            />
          </div>

          {/* =====================================================
              DESKTOP IMAGE
          ====================================================== */}
          <div
            className="
              pointer-events-none

              absolute
              z-0

              hidden

              h-full
              w-[58%]

              lg:bottom-[1px]
              lg:right-[-115px]
              lg:block

              xl:bottom-0
              xl:right-[-10px]
            "
          >
            <Image
              src={lowerHero.backgroundImage.src}
              alt={lowerHero.backgroundImage.alt}
              fill
              priority
              className="
                object-contain
                object-bottom-right
              "
            />
          </div>

          {/* =====================================================
              MOBILE
          ====================================================== */}
          <div
            className="
              relative
              z-10

              flex
              h-full
              flex-col

              px-[13px]
              pt-[15px]

              min-[360px]:px-[15px]
              min-[360px]:pt-[17px]

              min-[390px]:px-5
              min-[390px]:pt-5

              md:hidden
            "
          >
            <h2
              className="
                max-w-[290px]

                font-red-hat-display
                text-[31px]
                font-extrabold
                leading-[34px]

                text-white

                min-[390px]:max-w-[360px]
                min-[390px]:text-[38px]
                min-[390px]:leading-[41.88px]
              "
            >
              {lowerHero.heading}
            </h2>

            <p
              className="
                mt-2
                max-w-[290px]

                font-red-hat-display
                text-[10px]
                font-[467]
                leading-[15px]

                text-white

                min-[390px]:max-w-[350px]
                min-[390px]:text-[12px]
                min-[390px]:leading-[18px]
              "
            >
              {lowerHero.description}
            </p>

            <div className="mt-5">
              <LowerHeroServiceGrid
                selectedService={selectedService}
                onSelect={handleServiceSelect}
                compact
              />
            </div>
          </div>

          {/* =====================================================
              TABLET
          ====================================================== */}
          <div
            className="
              relative
              z-10

              hidden
              h-full
              w-[60%]

              flex-col
              justify-center

              pl-8

              md:flex
              lg:hidden
            "
          >
            <h2
              className="
                max-w-[390px]

                font-red-hat-display
                text-[40px]
                font-bold
                leading-[46px]

                text-white
              "
            >
              {lowerHero.heading}
            </h2>

            <p
              className="
                mt-3
                max-w-[360px]

                font-red-hat-display
                text-[13px]
                font-[467]
                leading-[19px]

                text-white
              "
            >
              {lowerHero.description}
            </p>

            <div className="mt-5 w-[430px]">
              <LowerHeroServiceGrid
                selectedService={selectedService}
                onSelect={handleServiceSelect}
                tablet
              />
            </div>
          </div>

          {/* =====================================================
              DESKTOP
          ====================================================== */}
          <div
            className="
              relative
              z-10

              hidden
              h-full
              w-[55%]

              flex-col
              justify-center

              pl-16

              lg:flex
            "
          >
            <h2
              className="
                max-w-[520px]

                font-red-hat-display
                text-[60px]
                font-bold
                leading-[68px]

                text-white
              "
            >
              {lowerHero.heading}
            </h2>

            <p
              className="
                mt-5
                max-w-[505px]

                font-red-hat-display
                text-[18px]
                leading-[1.5]

                text-white
              "
            >
              {lowerHero.description}
            </p>

            <div className="mt-6 h-[176px] w-[560px]">
              <LowerHeroServiceGrid
                selectedService={selectedService}
                onSelect={handleServiceSelect}
              />
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

type LowerHeroServiceGridProps = {
  selectedService: ServiceType;
  onSelect: (service: ServiceType) => void;
  compact?: boolean;
  tablet?: boolean;
};

function LowerHeroServiceGrid({
  selectedService,
  onSelect,
  compact = false,
  tablet = false,
}: LowerHeroServiceGridProps) {
  const services = data.lowerHero.serviceTabs.items;

  return (
    <div
      className={`
        overflow-hidden

        bg-white

        ${compact ? 'rounded-[18px]' : tablet ? 'rounded-[20px]' : 'rounded-[24px]'}
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
          const isActive = selectedService === service.value;

          return (
            <button
              key={service.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                onSelect(service.value as ServiceType);
              }}
              className={`
                  group

                  flex
                  items-center

                  border-[#EAECF0]

                  text-left

                  transition-colors

                  ${
                    compact
                      ? `
                        min-h-[56px]
                        gap-2
                        px-3
                      `
                      : tablet
                        ? `
                          min-h-[64px]
                          gap-2.5
                          px-4
                        `
                        : `
                          min-h-[87px]
                          gap-3
                          px-5
                        `
                  }

                  ${index % 3 !== 2 ? 'sm:border-r' : ''}

                  ${index < 3 ? 'sm:border-b' : ''}

                  ${index % 2 === 0 ? 'border-r sm:border-r-0' : ''}

                  ${index < 4 ? 'border-b sm:border-b-0' : ''}

                  ${
                    isActive
                      ? `
                        bg-[#E7F6F5]
                        text-[#00897B]
                      `
                      : `
                        bg-white
                        text-[#667085]

                        hover:bg-[#F9FAFB]
                      `
                  }
                `}
            >
              <Image
                src={isActive ? service.activeIcon : service.icon}
                alt={service.iconAlt}
                width={48}
                height={48}
                className={`
                    shrink-0
                    object-contain

                    ${
                      compact
                        ? `
                          h-[18px]
                          w-[18px]
                        `
                        : tablet
                          ? `
                            h-[22px]
                            w-[22px]
                          `
                          : `
                            h-[26px]
                            w-[26px]
                          `
                    }
                  `}
              />

              <span
                className={`
                    min-w-0
                    flex-1

                    font-red-hat-display

                    ${isActive ? 'font-extrabold' : 'font-[550]'}

                    ${
                      compact
                        ? `
                          text-[10px]

                          min-[390px]:text-[11px]
                        `
                        : tablet
                          ? `
                            text-[13px]
                          `
                          : `
                            text-[16px]
                          `
                    }
                  `}
              >
                {service.label}
              </span>

              {isActive && (
                <ChevronRight
                  aria-hidden="true"
                  className={`
                      shrink-0

                      text-[#0C3354]

                      ${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'}
                    `}
                  strokeWidth={2}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
