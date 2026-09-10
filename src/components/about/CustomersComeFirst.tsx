import Image from 'next/image';

import data from '@/data/content.json';

export default function CustomersComeFirst() {
  const { customersComeFirst } = data.aboutUs;

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
      <div
        className="
          mx-auto
          w-full
          max-w-[1216px]

          rounded-[20px]

          border
          border-[#DFE6EBB2]

          bg-white

          p-5

          shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

          sm:rounded-[22px]
          sm:p-6

          md:rounded-[24px]
          md:p-7

          lg:rounded-[26px]
          lg:p-[28px]

          xl:h-[269px]
          xl:rounded-[28px]
          xl:p-[30px]
        "
      >
        {/* =====================================================
            HEADING
        ====================================================== */}
        <h2
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
          {customersComeFirst.heading}
        </h2>

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}
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
          {customersComeFirst.description}
        </p>

        {/* =====================================================
            HIGHLIGHTED FEEFO SECTION
        ====================================================== */}
        <div
          className="
            mt-4

            flex
            w-full

            flex-col
            items-start
            gap-3

            rounded-[12px]

            border
            border-[#0E7C7B33]

            bg-[#EEF9F9]

            p-3

            sm:flex-row
            sm:items-center
            sm:gap-4
            sm:rounded-[13px]
            sm:p-[14px]

            md:rounded-[14px]
            md:p-4
          "
        >
          {/* =================================================
              LOGO CONTAINER
          ================================================== */}
          <div
            className="
              flex
              h-[46px]
              w-[110px]
              shrink-0

              items-center
              justify-center

              rounded-full

              border
              border-[#DFE6EBB2]

              bg-white

              shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

              sm:h-[49px]
              sm:w-[118px]

              md:h-[51px]
              md:w-[123px]

              xl:h-[53px]
              xl:w-[128px]
            "
          >
            <Image
              src={customersComeFirst.highlight.logo}
              alt={customersComeFirst.highlight.logoAlt}
              width={99}
              height={23}
              className="
                h-auto
                w-[82px]

                object-contain

                sm:w-[88px]

                md:w-[94px]

                xl:h-[23.05px]
                xl:w-[98.99px]
              "
            />
          </div>

          {/* =================================================
              HIGHLIGHT TEXT
          ================================================== */}
          <p
            className="
              flex-1

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
            {customersComeFirst.highlight.text}
          </p>
        </div>
      </div>
    </section>
  );
}
