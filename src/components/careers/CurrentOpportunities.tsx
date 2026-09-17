import Link from 'next/link';

import { Mail } from 'lucide-react';

import data from '@/data/content.json';

export default function CurrentOpportunities() {
  const { currentOpportunities } = data.careers;

  return (
    <section
      id="opportunities"
      className="
        w-full
        bg-white

        px-3
        pb-[70px]
        pt-[0px]

        sm:px-5
        sm:pb-[80px]
        sm:pt-[0px]

        md:px-6
        md:pb-[90px]
        md:pt-[60px]

        lg:px-8
        lg:pb-[100px]
        lg:pt-[70px]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1320px]
        "
      >
        {/* =====================================================
            HEADING
        ====================================================== */}
        <div className="text-center">
          <h2
            className="
              font-red-hat-display
              font-[645]

              text-[30px]
              leading-[36px]

              tracking-[0]

              text-[#082A49]

              sm:text-[34px]
              sm:leading-[40px]

              md:text-[38px]
              md:leading-[46px]

              lg:text-[42px]
              lg:leading-[50px]

              xl:text-[44px]
              xl:leading-[52px]
            "
          >
            {currentOpportunities.heading}
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-[760px]

              font-red-hat-display
              font-[467]

              text-[14px]
              leading-[20px]

              tracking-[0]

              !text-[#576574]

              sm:text-[15px]
              sm:leading-[22px]

              md:text-[16px]
              md:leading-[23px]

              lg:text-[17px]
              lg:leading-[25px]

              xl:text-[18px]
              xl:leading-[26px]
            "
          >
            {currentOpportunities.subheading}
          </p>
        </div>

        {/* =====================================================
            EMPTY / GENERAL APPLICATION CARD
        ====================================================== */}
        <div
          className="
            mx-auto
            mt-8

            w-full
            max-w-[832px]

            rounded-[20px]

            border
            border-[#DFE6EBB2]

            bg-white

            p-5

            shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

            sm:mt-9
            sm:rounded-[22px]
            sm:p-6

            md:mt-10
            md:rounded-[24px]
            md:p-7

            lg:rounded-[26px]
            lg:p-[28px]

            xl:h-[386px]
            xl:rounded-[28px]
            xl:p-[30px]
          "
        >
          {/* =================================================
              CARD HEADING
          ================================================== */}
          <h3
            className="
              font-red-hat-display
              font-[645]

              text-[21px]
              leading-[29px]

              tracking-[0]

              text-[#0C3354]

              sm:text-[22px]
              sm:leading-[31px]

              md:text-[23px]
              md:leading-[32px]

              lg:text-[24px]
              lg:leading-[34px]

              xl:text-[26px]
              xl:leading-[36.4px]
            "
          >
            {currentOpportunities.emptyState.heading}
          </h3>

          {/* =================================================
              DESCRIPTION
          ================================================== */}
          <div
            className="
              mt-3

              space-y-5

              font-red-hat-display
              font-[467]

              text-[14px]
              leading-[21px]

              tracking-[0.02em]

              text-[#576574]

              sm:text-[15px]
              sm:leading-[22px]

              md:text-[16px]
              md:leading-[24px]

              lg:text-[17px]
              lg:leading-[26px]

              xl:text-[18px]
              xl:leading-[28px]
            "
          >
            {currentOpportunities.emptyState.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="!text-[#576574]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* =================================================
              EMAIL CTA
          ================================================== */}
          <Link
            href={currentOpportunities.emptyState.button.href}
            className="
              mt-5

              inline-flex
              min-h-[44px]

              items-center
              justify-center
              gap-2

              rounded-full

              bg-[#00897B]

              px-5
              py-2.5

              font-red-hat-display
              text-[13px]
              font-[645]
              leading-5

              text-white

              transition-colors

              hover:bg-[#00786C]

              sm:text-[14px]

              md:text-[15px]
            "
          >
            <Mail
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              strokeWidth={2}
            />

            <span>{currentOpportunities.emptyState.button.label}</span>
          </Link>

          {/* =================================================
              SUPPORT LINK
          ================================================== */}
          <p
            className="
              mt-4

              font-red-hat-display
              font-[467]

              text-[13px]
              leading-[20px]

              !text-[#576574]

              sm:text-[14px]
              sm:leading-[21px]

              md:text-[15px]
              md:leading-[22px]

              lg:text-[16px]
              lg:leading-[23px]
            "
          >
            {currentOpportunities.emptyState.support.prefix}{' '}
            <Link
              href={currentOpportunities.emptyState.support.href}
              className="
                font-[550]

                text-[#0E7C7B]

                underline
                underline-offset-[3px]

                transition-colors

                hover:text-[#00897B]
              "
            >
              {currentOpportunities.emptyState.support.label}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
