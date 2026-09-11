import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import data from '@/data/content.json';

export default function ThreeWaysToGetAnswer() {
  const { waysToGetAnswer } = data.customerSupport;

  return (
    <section
      className="
        w-full
        bg-[#F8FAFC]

        px-4
        py-[50px]

        sm:px-6
        sm:py-[55px]

        md:px-8
        md:py-[60px]

        lg:px-[60px]
        lg:pb-[80px]
        lg:pt-[60px]
      "
    >
      <div className="mx-auto w-full max-w-[1320px]">
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
            {waysToGetAnswer.heading}
          </h2>

          <p
            className="
              mx-auto
              mt-3

              max-w-[800px]

              font-red-hat-display
              font-[467]

              text-[14px]
              leading-[20px]

              tracking-[0]

              !text-[#0D3B66]

              sm:text-[15px]

              md:text-[16px]

              lg:text-[17px]

              xl:text-[18px]
              xl:leading-[18px]
            "
          >
            {waysToGetAnswer.description}
          </p>
        </div>

        {/* =====================================================
            CARDS
        ====================================================== */}
        <div
          className="
            mt-8

            grid
            grid-cols-1
            gap-4

            sm:mt-9
            sm:gap-5

            md:grid-cols-2

            lg:mt-10
            lg:grid-cols-3
            lg:gap-5

            xl:gap-6
          "
        >
          {waysToGetAnswer.cards.map((card) => (
            <article
              key={card.id}
              className="
                flex
                min-h-[280px]
                w-full
                flex-col

                rounded-[20px]

                border
                border-[#DFE6EBB2]

                bg-white

                p-5

                shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                sm:min-h-[295px]
                sm:rounded-[22px]
                sm:p-6

                md:min-h-[310px]
                md:rounded-[24px]

                lg:min-h-[320px]
                lg:rounded-[26px]
                lg:p-7

                xl:h-[328px]
                xl:min-h-[328px]
                xl:w-[392px]
                xl:rounded-[28px]
                xl:p-[30px]
              "
            >
              {/* =================================================
                  ICON CONTAINER
              ================================================== */}
              <div
                className="
                  flex
                  h-[60px]
                  w-[60px]
                  shrink-0

                  items-center
                  justify-center

                  rounded-[12px]

                  bg-[#EEF9F9]

                  sm:h-[64px]
                  sm:w-[64px]
                  sm:rounded-[13px]

                  md:h-[68px]
                  md:w-[68px]
                  md:rounded-[14px]

                  lg:h-[74px]
                  lg:w-[74px]
                  lg:rounded-[15px]

                  xl:h-[80px]
                  xl:w-[80px]
                  xl:rounded-[16px]
                "
              >
                <Image
                  src={card.icon}
                  alt={card.iconAlt}
                  width={40}
                  height={40}
                  className="
                    h-[30px]
                    w-[30px]
                    object-contain

                    sm:h-[32px]
                    sm:w-[32px]

                    md:h-[34px]
                    md:w-[34px]

                    lg:h-[36px]
                    lg:w-[36px]

                    xl:h-[40px]
                    xl:w-[40px]
                  "
                />
              </div>

              {/* =================================================
                  CARD HEADING
              ================================================== */}
              <h3
                className="
                  mt-5

                  font-red-hat-display
                  font-[645]

                  text-[20px]
                  leading-[28px]

                  tracking-[0]

                  text-[#0C3354]

                  sm:text-[21px]

                  md:text-[22px]

                  xl:text-[22px]
                  xl:leading-[36.4px]
                "
              >
                {card.title}
              </h3>

              {/* =================================================
                  DESCRIPTION
              ================================================== */}
              <p
                className="
                  mt-2

                  font-red-hat-display
                  font-[467]

                  text-[14px]
                  leading-[20px]

                  tracking-[0]

                  !text-[#576574]

                  sm:text-[15px]
                  sm:leading-[21px]

                  md:text-[16px]
                  md:leading-[23px]

                  xl:text-[18px]
                  xl:leading-[26px]
                "
              >
                {card.description}
              </p>

              {/* =================================================
                  LINK
              ================================================== */}
              <Link
                href={card.link.href}
                className="
                  mt-auto
                  inline-flex
                  w-fit

                  items-center
                  gap-1.5

                  font-inter
                  text-[12px]
                  font-semibold
                  leading-[18px]

                  text-[#00897B]

                  transition-colors

                  hover:text-[#00786C]

                  sm:text-[13px]

                  xl:text-[14px]
                  xl:leading-[20px]
                "
              >
                <span>{card.link.label}</span>

                <ArrowRight
                  aria-hidden="true"
                  className="
                    h-3.5
                    w-3.5

                    xl:h-4
                    xl:w-4
                  "
                  strokeWidth={2}
                />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
