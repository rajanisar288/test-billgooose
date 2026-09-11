import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Mail } from 'lucide-react';

import data from '@/data/content.json';

export default function SupportHero() {
  const { customerSupport } = data;

  return (
    <section
      className="
        w-full
        bg-white

        px-4
        pb-[60px]
        pt-[18px]

        sm:px-6
        sm:pb-[70px]
        sm:pt-[22px]

        md:px-8
        md:pb-[80px]
        md:pt-[26px]

        lg:px-8
        lg:pb-[90px]
        lg:pt-[50px]
      "
    >
      <div className="mx-auto w-full max-w-[1216px]">
        {/* =====================================================
            BREADCRUMB
        ====================================================== */}
        <div
          className="
            flex
            items-center
            gap-2

            font-red-hat-display
            font-[467]

            text-[13px]
            leading-none

            text-[#0C3354]

            sm:text-[14px]

            md:text-[15px]

            xl:text-[16px]
          "
        >
          <Link
            href={customerSupport.breadcrumb.home.href}
            className="
              underline
              decoration-[1px]
              underline-offset-[3px]

              transition-colors

              hover:text-[#00897B]
            "
          >
            {customerSupport.breadcrumb.home.label}
          </Link>

          <span
            aria-hidden="true"
            className="text-[#98A2B3]"
          >
            ›
          </span>

          <span>{customerSupport.breadcrumb.current}</span>
        </div>

        {/* =====================================================
            HERO CONTENT
        ====================================================== */}
        <div
          className="
            mt-[20px]

            grid
            grid-cols-1

            gap-10

            md:gap-12

            lg:grid-cols-[480px_minmax(0,1fr)]
            lg:items-start
            lg:gap-[40px]

            xl:grid-cols-[560px_minmax(0,1fr)]
            xl:gap-[60px]
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================== */}
          <div className="pt-0">
            {/* HEADING */}
            <h1
              className="
                max-w-[430px]

                font-red-hat-display
                font-[645]

                text-[40px]
                leading-[44px]

                tracking-[-0.01em]

                text-[#0C3354]

                sm:text-[48px]
                sm:leading-[53px]

                md:text-[56px]
                md:leading-[61px]

                lg:max-w-[450px]
                lg:text-[58px]
                lg:leading-[64px]

                xl:max-w-[500px]
                xl:text-[64px]
                xl:leading-[70px]
              "
            >
              {customerSupport.hero.heading}
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                mt-[24px]
                max-w-[540px]

                font-red-hat-display
                font-[467]

                text-[15px]
                leading-[22px]

                tracking-[0]

                !text-[#0C3354]

                sm:text-[16px]
                sm:leading-[24px]

                md:text-[18px]
                md:leading-[26px]

                lg:text-[19px]
                lg:leading-[27px]

                xl:text-[20px]
                xl:leading-[28px]
              "
            >
              {customerSupport.hero.description}
            </p>

            {/* =================================================
                BUTTONS
            ================================================== */}
            <div
              className="
                mt-[28px]

                flex
                flex-row
                flex-wrap
                items-center

                gap-3
              "
            >
              <Link
                href={customerSupport.hero.primaryButton.href}
                className="
                  inline-flex
                  min-h-[46px]

                  items-center
                  justify-center
                  gap-2

                  rounded-full

                  bg-[#00897B]

                  px-5
                  py-2.5

                  font-red-hat-display
                  text-[14px]
                  font-[645]
                  leading-5

                  text-white

                  transition-colors

                  hover:bg-[#00786C]

                  sm:text-[15px]
                "
              >
                <span>{customerSupport.hero.primaryButton.label}</span>

                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </Link>

              <Link
                href={customerSupport.hero.email.href}
                className="
                  inline-flex
                  min-h-[46px]

                  items-center
                  justify-center
                  gap-2

                  rounded-full

                  border
                  border-[#D0D5DD]

                  bg-white

                  px-5
                  py-2.5

                  font-red-hat-display
                  text-[14px]
                  font-bold
                  leading-[21px]

                  text-[#344054]

                  transition-colors

                  hover:bg-[#F9FAFB]

                  sm:text-[15px]
                  sm:leading-[22px]

                  xl:text-[16px]
                  xl:leading-[24px]
                "
              >
                <Mail
                  aria-hidden="true"
                  className="
                    h-[18px]
                    w-[18px]
                    shrink-0

                    sm:h-[19px]
                    sm:w-[19px]

                    xl:h-5
                    xl:w-5
                  "
                  strokeWidth={1.8}
                />

                <span>{customerSupport.hero.email.label}</span>
              </Link>
            </div>

            {/* =================================================
                AVAILABILITY
            ================================================== */}
            <div
              className="
                mt-7

                flex
                items-center
                gap-2
              "
            >
              <Image
                src={customerSupport.hero.availability.icon}
                alt={customerSupport.hero.availability.iconAlt}
                width={20}
                height={20}
                className="
                  h-[16px]
                  w-[16px]
                  shrink-0

                  object-contain

                  sm:h-[18px]
                  sm:w-[18px]

                  xl:h-5
                  xl:w-5
                "
              />

              <p
                className="
                  font-red-hat-display
                  font-[645]

                  text-[13px]
                  leading-[20px]

                  tracking-[0]

                  !text-[#667085]

                  sm:text-[14px]
                  sm:leading-[21px]

                  md:text-[15px]
                  md:leading-[22px]

                  xl:text-[16px]
                  xl:leading-[24px]
                "
              >
                {customerSupport.hero.availability.text}
              </p>
            </div>
          </div>

          {/* =================================================
              RIGHT IMAGE AREA
          ================================================== */}
          <div
            className="
              relative

              mx-auto

              h-[430px]
              w-full
              max-w-[520px]

              sm:h-[500px]

              md:h-[560px]

              lg:mx-0
              lg:h-[500px]
              lg:max-w-none

              xl:h-[560px]
            "
          >
            {/* BACKGROUND IMAGE */}
            <div
              className="
                absolute

                left-1/2
                top-[30px]

                h-[340px]
                w-[92%]

                -translate-x-1/2

                overflow-hidden

                rounded-[22px]

                sm:top-[40px]
                sm:h-[400px]

                md:top-[50px]
                md:h-[450px]
                md:rounded-[24px]

                lg:left-[8%]
                lg:top-[10px]
                lg:h-[420px]
                lg:w-[94%]
                lg:translate-x-0
                lg:rounded-[26px]

                xl:left-[7%]
                xl:top-0
                xl:h-[450px]
                xl:rounded-[30px]
              "
            >
              <Image
                src={customerSupport.hero.backgroundImage.src}
                alt={customerSupport.hero.backgroundImage.alt}
                fill
                priority
                sizes="
                  (max-width: 639px) 92vw,
                  (max-width: 1023px) 520px,
                  (max-width: 1279px) 92vw,
                  560px
                "
                className="
                  object-cover
                  object-center
                "
              />
            </div>

            {/* GOOSE IMAGE */}
            <div
              className="
                pointer-events-none

                absolute

                left-1/2
                top-[-6px]

                h-[440px]
                w-[360px]

                -translate-x-1/2

                sm:top-[-10px]
                sm:h-[510px]
                sm:w-[420px]

                md:top-[-14px]
                md:h-[580px]
                md:w-[470px]

                lg:left-[52%]
                lg:top-[-20px]
                lg:h-[500px]
                lg:w-[440px]

                xl:left-[50%]
                xl:top-[-30px]
                xl:h-[560px]
                xl:w-[500px]
              "
            >
              <Image
                src={customerSupport.hero.gooseImage.src}
                alt={customerSupport.hero.gooseImage.alt}
                fill
                priority
                sizes="
                  (max-width: 639px) 360px,
                  (max-width: 767px) 420px,
                  (max-width: 1023px) 470px,
                  (max-width: 1279px) 440px,
                  500px
                "
                className="
                  object-contain
                  object-bottom
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
