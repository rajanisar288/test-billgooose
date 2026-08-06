import Image from 'next/image';

import data from '@/data/content.json';

export default function ResultHero() {
  const { hero } = data.resultPage;

  return (
    <section
      className="
        relative overflow-hidden
        bg-[#0B2B43]

        h-[560px]
        px-4 pt-7

        min-[390px]:h-[580px]

        sm:h-[610px]
        sm:px-6
        sm:pt-9

        md:h-[630px]

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
        {/* Goose */}
        <Image
          src={hero.mascot.src}
          alt={hero.mascot.alt}
          width={368}
          height={510}
          priority
          className="
            pointer-events-none
            absolute bottom-[-34px]
            left-1/2
            h-auto w-[235px]
            -translate-x-1/2
            object-contain object-top

            min-[390px]:bottom-[-42px]
            min-[390px]:w-[255px]

            sm:bottom-[-55px]
            sm:w-[300px]

            md:w-[320px]

            lg:bottom-[-55px]
            lg:left-[20px]
            lg:w-[340px]
            lg:translate-x-0

            xl:bottom-auto
            xl:left-[39px]
            xl:top-1
            xl:h-[510px]
            xl:w-[368px]
          "
        />

        {/* Heading and services */}
        <div
          className="
            relative z-10 mx-auto
            flex w-full max-w-[620px]
            flex-col items-center
            text-center

            lg:ml-[370px]
            lg:max-w-[620px]
            lg:items-start
            lg:pt-[52px]
            lg:text-left

            xl:ml-[435px]
            xl:max-w-[650px]
            xl:pt-[56px]
          "
        >
          <h1
            className="
              font-red-hat-display
              text-[30px] font-extrabold
              leading-[35px]
              tracking-[0]
              text-white

              min-[390px]:text-[32px]
              min-[390px]:leading-[38px]

              sm:text-[38px]
              sm:leading-[44px]

              md:text-[42px]
              md:leading-[48px]

              lg:text-[46px]
              lg:leading-[51px]

              xl:text-[50.82px]
              xl:leading-[55.27px]
            "
          >
            <span className="block">{hero.heading.firstLine}</span>

            <span className="block">{hero.heading.secondLine}</span>
          </h1>

          <div
            className="
              mt-6 grid grid-cols-3
              items-center justify-center
              gap-3

              min-[390px]:gap-4

              sm:mt-8
              sm:grid-cols-6
              sm:gap-3

              md:gap-4

              lg:mt-8
              lg:flex
              lg:justify-start

              xl:mt-9
              xl:gap-4
            "
          >
            {hero.services.map((service) => (
              <div
                key={service.id}
                className="
                  flex h-[58px] w-[58px]
                  items-center justify-center
                  rounded-full
                  bg-[#FFFFFF26]

                  min-[390px]:h-[64px]
                  min-[390px]:w-[64px]

                  sm:h-[72px]
                  sm:w-[72px]

                  md:h-[80px]
                  md:w-[80px]

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
                    h-[44px] w-[44px]
                    object-contain

                    min-[390px]:h-[48px]
                    min-[390px]:w-[48px]

                    sm:h-[55px]
                    sm:w-[55px]

                    md:h-[62px]
                    md:w-[62px]

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
