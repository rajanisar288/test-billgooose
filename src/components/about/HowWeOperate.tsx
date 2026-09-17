import Image from 'next/image';

import data from '@/data/content.json';

export default function HowWeOperate() {
  const { howWeOperate } = data.aboutUs;

  return (
    <section
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

          bg-[#F9FAFB]

          p-5

          sm:rounded-[22px]
          sm:p-6

          md:rounded-[24px]
          md:p-7

          lg:rounded-[26px]
          lg:p-[28px]

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
          {howWeOperate.heading}
        </h2>

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}
        <div
          className="
            mt-3

            space-y-5

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
          {howWeOperate.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="!text-[#576574]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* =====================================================
            HIGHLIGHT / SEPARATOR
        ====================================================== */}
        <div
          className="
            mt-5

            flex
            w-full
            items-center

            gap-3

            rounded-[10px]

            border
            border-[#EAECF0]

            bg-white

            px-3
            py-3

            sm:rounded-[11px]
            sm:px-[14px]

            md:rounded-[12px]
            md:px-[15px]

            lg:rounded-[13px]
            lg:px-4

            xl:rounded-[14px]
            xl:px-4
            xl:py-[14px]
          "
        >
          <Image
            src={howWeOperate.highlight.icon}
            alt={howWeOperate.highlight.iconAlt}
            width={23}
            height={27}
            className="
              h-[23px]
              w-[20px]
              shrink-0
              object-contain

              sm:h-[24px]
              sm:w-[21px]

              md:h-[25px]
              md:w-[22px]

              xl:h-[27px]
              xl:w-[23px]
            "
          />

          <p
            className="
              font-red-hat-display
              font-[467]

              text-[12px]
              leading-[18px]

              tracking-[0]

              !text-[#576574]

              sm:text-[13px]
              sm:leading-[19px]

              md:text-[14px]
              md:leading-[20px]

              lg:text-[15px]
              lg:leading-[21px]

              xl:text-[16px]
              xl:leading-[22px]
            "
          >
            <span
              className="
                font-[645]
                !text-[#101828]
              "
            >
              {howWeOperate.highlight.textStrong}
            </span>{' '}
            {howWeOperate.highlight.textRest}
          </p>
        </div>
      </div>
    </section>
  );
}
