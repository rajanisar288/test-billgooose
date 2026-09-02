import Image from 'next/image';
import Link from 'next/link';

import data from '@/data/content.json';

type ResultHeroProps = {
  variant?: 'default' | 'mobile';
};

export default function ResultHero({ variant = 'default' }: ResultHeroProps) {
  const { hero } = data.resultPage;

  const isMobileResult = variant === 'mobile';

  return (
    <section
      className="
        relative overflow-hidden
        bg-[#0B2B43]

        h-[235px]
        px-4

        min-[390px]:h-[250px]
        min-[390px]:px-5

        sm:h-[290px]
        sm:px-6

        md:h-[360px]

        lg:h-[500px]
        lg:px-10
        lg:pt-0

        xl:h-[457px]
      "
    >
      <div
        className="
          relative mx-auto h-full
          w-full max-w-[1440px]
        "
      >
        {/* =====================================================
            GOOSE
        ====================================================== */}
        <Image
          src={hero.mascot.src}
          alt={hero.mascot.alt}
          width={368}
          height={510}
          className="
            pointer-events-none
            absolute

            bottom-[-20px]
            left-[-42px]

            h-[282px]
            w-[204px]

            object-contain
            object-bottom

            min-[390px]:bottom-[-22px]
            min-[390px]:left-[-38px]

            sm:bottom-[-24px]
            sm:left-[-30px]

            md:bottom-[-30px]
            md:left-[-18px]
            md:h-[365px]
            md:w-[264px]

            lg:bottom-[-20px]
            lg:left-[20px]
            lg:h-auto
            lg:w-[340px]

            xl:bottom-auto
            xl:left-[6px]
            xl:top-[-55px]
            xl:h-[510px]
            xl:w-[368px]
          "
        />

        {/* =====================================================
            HEADING + DESCRIPTION + SERVICE ICONS
        ====================================================== */}
        <div
          className="
            relative z-10

            ml-[47%]

            flex h-full
            w-[53%]
            flex-col
            justify-center

            text-left

            min-[390px]:ml-[48%]
            min-[390px]:w-[52%]

            sm:ml-[45%]
            sm:w-[55%]

            md:ml-[42%]
            md:w-[58%]

            lg:ml-[370px]
            lg:h-auto
            lg:w-full
            lg:max-w-[620px]
            lg:items-start
            lg:justify-start
            lg:pt-[52px]
            lg:text-left

            xl:ml-[435px]
            xl:max-w-[650px]
            xl:pt-[56px]
          "
        >
          {/* =================================================
              HEADING
          ================================================== */}
          <h1
            className="
              font-red-hat-display

              text-[18px]
              font-bold
              leading-[23px]
              tracking-[0]

              text-white

              sm:text-[18px]
              sm:leading-[23px]

              md:text-[40px]
              md:font-extrabold
              md:leading-[46px]

              lg:text-[46px]
              lg:font-extrabold
              lg:leading-[51px]

              xl:text-[50.82px]
              xl:leading-[55.27px]
            "
          >
            {isMobileResult ? (
              <span className="block whitespace-nowrap">Mobile phone deals</span>
            ) : (
              <>
                <span className="block whitespace-nowrap">{hero.heading.firstLine}</span>

                <span className="block whitespace-nowrap">{hero.heading.secondLine}</span>
              </>
            )}
          </h1>

          {/* =================================================
              MOBILE RESULT DESCRIPTION

              Only shown for mobile results.
          ================================================== */}
          {isMobileResult && (
            <p
              className="
                mt-2
                max-w-[240px]

                font-red-hat-display

                text-[8px]
                font-medium
                leading-[11px]

                text-[#D0D5DD]

                min-[390px]:max-w-[260px]
                min-[390px]:text-[9px]
                min-[390px]:leading-[12px]

                sm:mt-2.5
                sm:max-w-[310px]
                sm:text-[10px]
                sm:leading-[14px]

                md:mt-3
                md:max-w-[420px]
                md:text-[12px]
                md:leading-[17px]

                lg:max-w-[510px]
                lg:text-[15px]
                lg:leading-[20px]

                xl:max-w-[540px]
              "
            >
              Looking for a new phone contract? We can help you find your ideal handset on a pay
              monthly plan that suits your needs. Happy with your current phone?{' '}
              <Link
                href="/result?service=sim-only"
                className="
                  font-bold

                  text-white

                  underline
                  underline-offset-2

                  transition-opacity

                  hover:opacity-80
                "
              >
                Compare SIM only deals
              </Link>{' '}
              instead.
            </p>
          )}

          {/* =================================================
              SERVICE ICONS
          ================================================== */}
          <div
            className={`
              grid
              grid-cols-3
              justify-start
              gap-1.5

              min-[390px]:gap-2

              sm:gap-2

              md:grid-cols-[repeat(3,68px)]
              md:gap-x-[55px]
              md:gap-y-[6px]

              lg:flex
              lg:justify-start

              xl:gap-4

              ${
                isMobileResult
                  ? `
                    mt-3

                    min-[390px]:mt-3

                    sm:mt-4

                    md:mt-5

                    lg:mt-6

                    xl:mt-7
                  `
                  : `
                    mt-4

                    sm:mt-5

                    md:mt-6

                    lg:mt-8

                    xl:mt-9
                  `
              }
            `}
          >
            {hero.services.map((service) => (
              <div
                key={service.id}
                className="
                  flex
                  h-[44px]
                  w-[44px]

                  items-center
                  justify-center

                  rounded-full

                  bg-[#FFFFFF26]

                  min-[390px]:h-[48px]
                  min-[390px]:w-[48px]

                  sm:h-[56px]
                  sm:w-[56px]

                  md:h-[68px]
                  md:w-[68px]

                  lg:h-[88px]
                  lg:w-[88px]

                  xl:h-[102.424px]
                  xl:w-[102.424px]
                "
              >
                <Image
                  src={service.icon}
                  alt={service.alt}
                  width={80}
                  height={80}
                  className="
                    h-[30px]
                    w-[30px]

                    object-contain

                    min-[390px]:h-[34px]
                    min-[390px]:w-[34px]

                    sm:h-[40px]
                    sm:w-[40px]

                    md:h-[49px]
                    md:w-[49px]

                    lg:h-[68px]
                    lg:w-[68px]

                    xl:h-20
                    xl:w-20
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
