import Image from 'next/image';

import data from '@/data/content.json';

export default function ResultHero() {
  const { hero } = data.resultPage;

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
        {/* Goose */}
        <Image
          src={hero.mascot.src}
          alt={hero.mascot.alt}
          width={368}
          height={510}
          priority
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

            lg:bottom-[-55px]
            lg:left-[20px]
            lg:h-auto
            lg:w-[340px]

            xl:bottom-auto
            xl:left-[39px]
            xl:top-1
            xl:h-[510px]
            xl:w-[368px]
          "
        />

        {/* Heading + service icons */}
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
            <span className="block whitespace-nowrap">{hero.heading.firstLine}</span>

            <span className="block whitespace-nowrap">{hero.heading.secondLine}</span>
          </h1>

          {/* Service icons */}
          <div
            className="
    mt-4
    grid
    grid-cols-3
    justify-start
    gap-1.5

    min-[390px]:gap-2

    sm:mt-5
    sm:gap-2

    md:mt-6
    md:grid-cols-[repeat(3,68px)]
    md:gap-x-[55px]
    md:gap-y-[6px]

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
