import Image from 'next/image';

import data from '@/data/content.json';

export default function EssentialServices() {
  const { essentialServices } = data.aboutUs;

  return (
    <section
      className="
        w-full
        bg-white

        px-3
        pb-[70px]
        pt-[30px]

        sm:px-5
        sm:pb-[80px]
        sm:pt-[36px]

        md:px-6
        md:pb-[90px]
        md:pt-[44px]

        lg:px-8
        lg:pb-[100px]
        lg:pt-[52px]
      "
    >
      {/* =====================================================
          ESSENTIAL SERVICES DARK SECTION
      ====================================================== */}
      <div
        className="
          relative

          mx-auto
          w-full
          max-w-[1216px]

          overflow-hidden

          rounded-[20px]

          bg-[#082A49]

          px-5
          py-8

          sm:rounded-[22px]
          sm:px-7
          sm:py-10

          md:min-h-[620px]
          md:rounded-[24px]
          md:px-10
          md:py-10

          lg:min-h-[700px]
          lg:rounded-[28px]
          lg:px-12
          lg:py-10

          xl:h-[800px]
          xl:min-h-[800px]
          xl:rounded-[30px]
          xl:px-0
          xl:py-0
        "
      >
        {/* =====================================================
            DESKTOP / LAPTOP GOOSE
        ====================================================== */}
        <div
          className="
            pointer-events-none

            relative
            mx-auto

            h-[300px]
            w-[230px]

            sm:h-[360px]
            sm:w-[280px]

            md:absolute
            md:left-[24px]
            md:top-[60px]
            md:h-[500px]
            md:w-[380px]

            lg:left-[30px]
            lg:top-[48px]
            lg:h-[610px]
            lg:w-[470px]

            xl:left-[36.38px]
            xl:top-[39.3px]
            xl:h-[721.4px]
            xl:w-[553.14px]
          "
        >
          <Image
            src={essentialServices.goose.src}
            alt={essentialServices.goose.alt}
            fill
            priority
            sizes="
              (max-width: 639px) 230px,
              (max-width: 767px) 280px,
              (max-width: 1023px) 380px,
              (max-width: 1279px) 470px,
              553px
            "
            className="
              object-contain
              object-center
            "
          />
        </div>

        {/* =====================================================
            RIGHT CONTENT
        ====================================================== */}
        <div
          className="
            relative
            z-10

            mt-6
            w-full

            md:ml-auto
            md:mt-0
            md:w-[48%]
            md:pt-[80px]

            lg:w-[49%]
            lg:pt-[90px]

            xl:absolute
            xl:right-[70px]
            xl:top-[110px]
            xl:w-[477px]
            xl:pt-0
          "
        >
          {/* =================================================
              HEADING
          ================================================== */}
          <h2
            className="
              mx-auto
              max-w-[520px]

              text-center

              font-red-hat-display
              font-[645]

              text-[30px]
              leading-[36px]

              tracking-[0]

              text-white

              sm:text-[34px]
              sm:leading-[40px]

              md:mx-0
              md:text-left
              md:text-[38px]
              md:leading-[46px]

              lg:text-[42px]
              lg:leading-[50px]

              xl:text-[44px]
              xl:leading-[52px]
            "
          >
            {essentialServices.heading}
          </h2>

          {/* =================================================
              SERVICE GRID
          ================================================== */}
          <div
            className="
              mx-auto
              mt-8

              grid
              w-full
              max-w-[420px]
              grid-cols-2
              gap-x-5
              gap-y-6

              sm:max-w-[500px]
              sm:grid-cols-3
              sm:gap-x-5
              sm:gap-y-7

              md:mx-0
              md:mt-9
              md:max-w-none
              md:grid-cols-2
              md:gap-[18px]

              lg:grid-cols-3
              lg:gap-[20px]

              xl:h-[399.42px]
              xl:w-[477px]
              xl:gap-[22.36px]
            "
          >
            {essentialServices.items.map((item) => (
              <div
                key={item.id}
                className="
                  flex
                  flex-col
                  items-center

                  text-center
                "
              >
                {/* =============================================
                    ICON CONTAINER
                ============================================== */}
                <div
                  className="
                    flex
                    h-[86px]
                    w-[86px]
                    shrink-0

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-white/10

                    bg-white/10

                    shadow-[0px_7.58px_22.75px_0px_rgba(15,30,60,0.06),0px_0.95px_1.9px_0px_rgba(15,30,60,0.04)]

                    sm:h-[96px]
                    sm:w-[96px]

                    md:h-[104px]
                    md:w-[104px]

                    lg:h-[124px]
                    lg:w-[124px]

                    xl:h-[144.06px]
                    xl:w-[144.06px]
                    xl:rounded-[94.77px]
                    xl:border-[0.95px]
                  "
                >
                  <Image
                    src={item.icon}
                    alt={item.iconAlt}
                    width={94}
                    height={94}
                    className="
                      h-[54px]
                      w-[54px]
                      object-contain

                      sm:h-[60px]
                      sm:w-[60px]

                      md:h-[66px]
                      md:w-[66px]

                      lg:h-[78px]
                      lg:w-[78px]

                      xl:h-[94px]
                      xl:w-[94px]
                    "
                  />
                </div>

                {/* =============================================
                    LABEL
                ============================================== */}
                <p
                  className="
                    mt-3

                    font-red-hat-display
                    text-[13px]
                    font-[467]
                    leading-[18px]

                    !text-white

                    sm:text-[14px]

                    md:text-[14px]

                    lg:text-[15px]

                    xl:text-[16px]
                    xl:leading-[22px]
                  "
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          COMPARISON INFORMATION CARD
      ====================================================== */}
      <div
        className="
          mx-auto
          mt-6

          w-full
          max-w-[1216px]

          rounded-[20px]

          border
          border-[#DFE6EBB2]

          bg-white

          p-5

          shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

          sm:mt-7
          sm:rounded-[22px]
          sm:p-6

          md:mt-8
          md:rounded-[24px]
          md:p-7

          lg:mt-9
          lg:rounded-[26px]
          lg:p-[28px]

          xl:h-[284px]
          xl:rounded-[28px]
          xl:p-[30px]
        "
      >
        {/* =================================================
            HEADING
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
          {essentialServices.comparisonInfo.heading}
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
            leading-[21px]

            tracking-[0.02em]

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
          {essentialServices.comparisonInfo.description}
        </p>

        {/* =================================================
            GREEN HIGHLIGHT
        ================================================== */}
        <div
          className="
            mt-4

            flex
            w-full

            items-center

            rounded-[10px]

            border
            border-[#0E7C7B33]

            bg-[#EEF9F9]

            p-3

            sm:rounded-[11px]
            sm:p-[14px]

            md:rounded-[12px]
            md:p-[14px]

            lg:rounded-[13px]
            lg:p-[15px]

            xl:h-[80px]
            xl:w-[1154px]
            xl:rounded-[14px]
            xl:p-4
          "
        >
          <p
            className="
              font-red-hat-display
              font-[550]

              text-[13px]
              leading-[19px]

              tracking-[0]

              !text-[#0E7C7B]

              sm:text-[14px]
              sm:leading-[20px]

              md:text-[15px]
              md:leading-[21px]

              xl:text-[16px]
              xl:leading-[22.75px]
            "
          >
            {essentialServices.comparisonInfo.highlight}
          </p>
        </div>
      </div>
    </section>
  );
}
