import Image from 'next/image';
import Link from 'next/link';

import data from '@/data/content.json';

export default function HowWeUseYourData() {
  const { howWeUseYourData } = data.aboutUs;

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
        "
      >
        {/* =====================================================
            HEADING
        ====================================================== */}
        <h2
          className="
            font-red-hat-display
            font-[645]

            text-[28px]
            leading-[36px]

            tracking-[0]

            text-[#0C3354]

            sm:text-[32px]
            sm:leading-[40px]

            md:text-[36px]
            md:leading-[44px]

            lg:text-[40px]
            lg:leading-[48px]

            xl:text-[44px]
            xl:leading-[52px]
          "
        >
          {howWeUseYourData.heading}
        </h2>

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}
        <p
          className="
            mt-4

            max-w-[1216px]

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
          {howWeUseYourData.description}
        </p>

        {/* =====================================================
            LOGO CARDS
        ====================================================== */}
        <div
          className="
            mt-8

            grid
            grid-cols-1
            gap-4

            sm:mt-9
            sm:gap-5

            md:grid-cols-3
            md:gap-5

            lg:mt-10
            lg:gap-6
          "
        >
          {howWeUseYourData.logos.map((logo) => (
            <div
              key={logo.id}
              className="
                flex
                min-h-[130px]
                w-full

                items-center
                justify-center

                rounded-[20px]

                border
                border-[#DFE6EBB2]

                bg-white

                p-5

                shadow-[0px_8px_24px_0px_rgba(15,30,60,0.06),0px_1px_2px_0px_rgba(15,30,60,0.04)]

                sm:min-h-[140px]
                sm:rounded-[22px]
                sm:p-6

                md:min-h-[150px]
                md:rounded-[24px]

                lg:min-h-[160px]
                lg:rounded-[26px]

                xl:h-[170px]
                xl:min-h-[170px]
                xl:w-[374.67px]
                xl:rounded-[28px]
                xl:p-[30px]
              "
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={221}
                height={102}
                className="
                  h-auto
                  max-h-[72px]
                  w-auto
                  max-w-[170px]

                  object-contain

                  sm:max-h-[80px]
                  sm:max-w-[185px]

                  md:max-h-[86px]
                  md:max-w-[195px]

                  lg:max-h-[94px]
                  lg:max-w-[210px]

                  xl:h-[101.7px]
                  xl:max-h-[101.7px]
                  xl:w-[221.06px]
                  xl:max-w-[221.06px]
                "
              />
            </div>
          ))}
        </div>

        {/* =====================================================
            FOOTER TEXT
        ====================================================== */}
        <div
          className="
            mt-8

            font-red-hat-display
            font-[467]

            text-[13px]
            leading-[20px]

            tracking-[0]

            text-[#576574]

            sm:text-[14px]
            sm:leading-[21px]

            md:text-[15px]
            md:leading-[22px]

            lg:text-[16px]
            lg:leading-[23px]
          "
        >
          <p className="!text-[#576574]">
            <span className="font-[645] !text-[#576574]">{howWeUseYourData.footerText.strong}</span>{' '}
            {howWeUseYourData.footerText.rest}{' '}
            <Link
              href={howWeUseYourData.footerText.privacyHref}
              className="
                font-[550]
                text-[#0E7C7B]
                underline
                underline-offset-[3px]

                transition-colors

                hover:text-[#00897B]
              "
            >
              {howWeUseYourData.footerText.privacyLabel}
            </Link>
          </p>

          <p className="mt-2 !text-[#576574]">{howWeUseYourData.footerText.lastLine}</p>
        </div>
      </div>
    </section>
  );
}
