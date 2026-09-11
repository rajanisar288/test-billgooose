import Image from 'next/image';

import data from '@/data/content.json';

export default function HowWeSupportYou() {
  const { howWeSupportYou } = data.customerSupport;

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pb-[70px]
        pt-[40px]

        sm:px-5
        sm:pb-[80px]
        sm:pt-[46px]

        md:px-6
        md:pb-[90px]
        md:pt-[52px]

        lg:px-8
        lg:pb-[100px]
        lg:pt-[60px]
      "
    >
      <div className="mx-auto w-full max-w-[1216px]">
        {/* =====================================================
            HEADING
        ====================================================== */}
        <h2
          className="
            mx-auto
            max-w-[760px]

            text-center

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
          {howWeSupportYou.heading}
        </h2>

        {/* =====================================================
            FIRST 4 CARDS
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
            md:gap-5

            lg:mt-10
            lg:gap-5
          "
        >
          {howWeSupportYou.cards.map((card) => (
            <article
              key={card.id}
              className="
                flex
                min-h-[150px]
                w-full

                items-start
                gap-4

                rounded-[20px]

                border
                border-[#DFE6EBB2]

                bg-white

                p-5

                shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                sm:min-h-[154px]
                sm:rounded-[22px]
                sm:p-6

                md:min-h-[156px]
                md:rounded-[24px]

                lg:min-h-[160px]
                lg:rounded-[26px]
                lg:gap-5
                lg:p-7

                xl:h-[162px]
                xl:min-h-[162px]
                xl:w-[598px]
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
                  CONTENT
              ================================================== */}
              <div className="min-w-0 flex-1">
                <h3
                  className="
                    font-red-hat-display
                    font-[645]

                    text-[21px]
                    leading-[28px]

                    tracking-[0]

                    text-[#0C3354]

                    sm:text-[22px]
                    sm:leading-[30px]

                    md:text-[22px]
                    md:leading-[30px]

                    lg:text-[24px]
                    lg:leading-[34px]

                    xl:text-[26px]
                    xl:leading-[36.4px]
                  "
                >
                  {card.title}
                </h3>

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

                    md:text-[15px]
                    md:leading-[22px]

                    lg:text-[16px]
                    lg:leading-[23px]

                    xl:text-[18px]
                    xl:leading-[26px]
                  "
                >
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* =====================================================
            LAST FULL WIDTH CARD
        ====================================================== */}
        <article
          className="
            mt-4

            flex
            min-h-[150px]
            w-full

            items-start
            gap-4

            rounded-[20px]

            border
            border-[#DFE6EBB2]

            bg-white

            p-5

            shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

            sm:mt-5
            sm:rounded-[22px]
            sm:p-6

            md:rounded-[24px]

            lg:rounded-[26px]
            lg:gap-5
            lg:p-7

            xl:h-[142px]
            xl:min-h-[142px]
            xl:gap-[20px]
            xl:rounded-[28px]
            xl:p-[30px]
          "
        >
          {/* ===================================================
              ICON CONTAINER
          ==================================================== */}
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
              src={howWeSupportYou.fullWidthCard.icon}
              alt={howWeSupportYou.fullWidthCard.iconAlt}
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

          {/* ===================================================
              CONTENT
          ==================================================== */}
          <div className="min-w-0 flex-1">
            <h3
              className="
                font-red-hat-display
                font-[645]

                text-[21px]
                leading-[28px]

                tracking-[0]

                text-[#0C3354]

                sm:text-[22px]
                sm:leading-[30px]

                md:text-[22px]
                md:leading-[30px]

                lg:text-[24px]
                lg:leading-[34px]

                xl:text-[26px]
                xl:leading-[36.4px]
              "
            >
              {howWeSupportYou.fullWidthCard.title}
            </h3>

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

                md:text-[15px]
                md:leading-[22px]

                lg:text-[16px]
                lg:leading-[23px]

                xl:text-[18px]
                xl:leading-[26px]
              "
            >
              {howWeSupportYou.fullWidthCard.description}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
