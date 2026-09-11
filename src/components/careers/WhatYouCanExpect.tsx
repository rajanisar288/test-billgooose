import data from '@/data/content.json';

export default function WhatYouCanExpect() {
  const { whatYouCanExpect } = data.careers;

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pb-[100px]
        pt-[60px]

        sm:px-5
        sm:pb-[120px]
        sm:pt-[70px]

        md:px-6
        md:pb-[140px]
        md:pt-[80px]

        lg:px-8
        lg:pb-[160px]
        lg:pt-[90px]
      "
    >
      <div className="mx-auto w-full max-w-[1216px]">
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
            {whatYouCanExpect.heading}
          </h2>
        </div>

        {/* =====================================================
            CARDS GRID
        ====================================================== */}
        <div
          className="
            mt-10

            grid
            grid-cols-1
            gap-4

            sm:mt-12
            sm:gap-5

            md:mt-14
            md:grid-cols-2

            lg:mt-16
            lg:grid-cols-3
            lg:gap-5

            xl:gap-5
          "
        >
          {whatYouCanExpect.cards.map((card) => (
            <article
              key={card.id}
              className="
                flex
                min-h-[145px]
                w-full
                flex-col

                rounded-[20px]

                border
                border-[#DFE6EBB2]

                bg-white

                p-5

                shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                sm:min-h-[150px]
                sm:rounded-[22px]
                sm:p-6

                md:min-h-[154px]
                md:rounded-[24px]

                lg:min-h-[158px]
                lg:rounded-[26px]
                lg:p-7

                xl:h-[162px]
                xl:min-h-[162px]
                xl:w-[392px]
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

              {/* =================================================
                  CARD DESCRIPTION
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
            </article>
          ))}
        </div>

        {/* =====================================================
            BOTTOM DESCRIPTION
        ====================================================== */}
        <p
          className="
            mt-8

            w-full

            font-red-hat-display
            font-[467]

            text-[14px]
            leading-[21px]

            tracking-[0.02em]

            !text-[#576574]

            sm:mt-9
            sm:text-[15px]
            sm:leading-[22px]

            md:mt-10
            md:text-[16px]
            md:leading-[24px]

            lg:mt-10
            lg:text-[17px]
            lg:leading-[26px]

            xl:text-[18px]
            xl:leading-[28px]
          "
        >
          {whatYouCanExpect.bottomDescription}
        </p>
      </div>
    </section>
  );
}
