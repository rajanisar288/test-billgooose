'use client';

import Link from 'next/link';

import data from '@/data/content.json';

export default function ContactHero() {
  const { contact } = data;

  return (
    <section className="w-full bg-white px-3 pb-6 pt-3 sm:px-5 lg:px-8 lg:pb-8 lg:pt-5">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* =====================================================
            HERO CARD
            - Gradient border via p-px wrapper
            - Solid mint-to-white gradient background
        ====================================================== */}
        <div
          className="
            relative

            mx-auto
            w-full
            max-w-[1320px]

            rounded-[22px]
            sm:rounded-[26px]
            lg:rounded-[30px]

            bg-[linear-gradient(180deg,rgba(0,168,149,0.55)_0%,rgba(0,168,149,0.18)_55%,rgba(0,168,149,0.05)_100%)]

            p-px
          "
        >
          <div
            className="
              relative

              flex
              min-h-[180px]
              flex-col
              items-center
              justify-center

              overflow-hidden

              rounded-[21px]
              sm:rounded-[25px]
              lg:min-h-[270px]
              lg:rounded-[29px]

              bg-[linear-gradient(180deg,#EEFFFB_0%,#F4FEFC_55%,#FAFFFE_100%)]

              px-5
              py-10

              sm:px-8
              sm:py-14

              lg:px-12
              lg:py-16
            "
          >
            {/* HEADING */}
            <h1
              className="
                text-center

                font-red-hat-display
                font-extrabold
                tracking-[0]

                text-secondary

                text-[40px]
                leading-[1.1]

                sm:text-[52px]
                sm:leading-[1.1]

                md:text-[58px]
                md:leading-[1.15]

                lg:text-[68.12px]
                lg:leading-[75.69px]
              "
            >
              {contact.hero.heading}
            </h1>

            {/* BREADCRUMB */}
            <nav
              aria-label="Breadcrumb"
              className="
                mt-4
                flex
                items-center
                justify-center
                gap-2

                sm:mt-5
                lg:mt-6
              "
            >
              <Link
                href={contact.hero.breadcrumb.homeHref}
                className="
                  font-red-hat-display
                  text-[14px]
                  font-[467]
                  leading-[100%]
                  tracking-[0]

                  text-[#475467]

                  underline
                  decoration-solid
                  underline-offset-[3px]
                  decoration-[0.5px]

                  transition-colors

                  hover:text-primary

                  sm:text-[16px]
                  sm:underline-offset-[4px]
                  sm:decoration-[0.75px]

                  lg:text-[18px]
                  lg:underline-offset-[5px]
                  lg:decoration-[1px]
                "
              >
                {contact.hero.breadcrumb.homeLabel}
              </Link>

              <span
                aria-hidden="true"
                className="
                  font-red-hat-display
                  text-[14px]
                  font-[467]
                  leading-[100%]

                  text-[#98A2B3]

                  sm:text-[16px]

                  lg:text-[18px]
                "
              >
                {contact.hero.breadcrumb.separator}
              </span>

              <span
                className="
                  font-red-hat-display
                  text-[14px]
                  font-[467]
                  leading-[100%]
                  tracking-[0]

                  text-[#475467]

                  underline
                  decoration-solid
                  underline-offset-[3px]
                  decoration-[0.5px]

                  sm:text-[16px]
                  sm:underline-offset-[4px]
                  sm:decoration-[0.75px]

                  lg:text-[18px]
                  lg:underline-offset-[5px]
                  lg:decoration-[1px]
                "
              >
                {contact.hero.breadcrumb.currentLabel}
              </span>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
